import type { ERPNextTaskForUser } from "@/@types/service/project";

export function buildTree(tasks: ERPNextTaskForUser[]): ERPNextTaskForUser[] {
  const taskMap = new Map<string, ERPNextTaskForUser & { subRows?: ERPNextTaskForUser[] }>();
  const rootTasks: (ERPNextTaskForUser & { subRows?: ERPNextTaskForUser[] })[] = [];

  // Create map of all tasks
  tasks.forEach((task) => {
    taskMap.set(task.name, { ...task, subRows: [] });
  });

  // Build tree structure
  tasks.forEach((task) => {
    const taskWithSubRows = taskMap.get(task.name)!;
    if (task.parent_task && taskMap.has(task.parent_task)) {
      const parent = taskMap.get(task.parent_task)!;
      if (!parent.subRows) parent.subRows = [];
      parent.subRows.push(taskWithSubRows);
    } else {
      rootTasks.push(taskWithSubRows);
    }
  });

  return rootTasks;
}

export function flattenTasks(tasks: ERPNextTaskForUser[]): ERPNextTaskForUser[] {
  const result: ERPNextTaskForUser[] = [];

  function traverse(taskList: ERPNextTaskForUser[], depth = 0) {
    taskList.forEach((task) => {
      result.push({ ...task, depth } as ERPNextTaskForUser & { depth: number });
      if (task.subRows && task.subRows.length > 0) {
        traverse(task.subRows, depth + 1);
      }
    });
  }

  traverse(tasks);
  return result;
}

export function calculateParentTaskDates(tasks: ERPNextTaskForUser[]): ERPNextTaskForUser[] {
  const taskMap = new Map<string, ERPNextTaskForUser>();

  // Create a map of all tasks
  tasks.forEach((task) => {
    taskMap.set(task.name, { ...task });
  });

  // Calculate parent end dates based on children (keep start dates unchanged)
  const calculateEndDate = (taskName: string): Date | null => {
    const task = taskMap.get(taskName)!;
    const children = tasks.filter((t) => t.parent_task === taskName);

    if (children.length === 0) {
      // Leaf task - return its own end date
      return task.exp_end_date ?? null;
    }

    // Parent task - calculate end date from children, keep original start date
    const childEndDates = children.map((child) => calculateEndDate(child.name)).filter(Boolean) as Date[];

    const calculatedEnd = childEndDates.length > 0 ? new Date(Math.max(...childEndDates.map((d) => d.getTime()))) : task.exp_end_date;

    // Update only the end date in the map, keep original start date
    const updatedTask = taskMap.get(taskName)!;
    updatedTask.exp_end_date = calculatedEnd;
    taskMap.set(taskName, updatedTask);

    return calculatedEnd ?? null;
  };

  // Calculate end dates for all root tasks (this will recursively calculate all children)
  const rootTasks = tasks.filter((t) => !t.parent_task);
  rootTasks.forEach((task) => calculateEndDate(task.name));

  return Array.from(taskMap.values());
}

export function getInitialExpandedState(tasks: ERPNextTaskForUser[], maxDepth = 2): Record<string, boolean> {
  const expanded: Record<string, boolean> = {};

  const setExpanded = (taskList: ERPNextTaskForUser[], currentDepth = 0, parentPath = "") => {
    taskList.forEach((task, index) => {
      const rowId = parentPath ? `${parentPath}.${index}` : `${index}`;

      if (currentDepth < maxDepth && task.subRows && task.subRows.length > 0) {
        expanded[rowId] = true;
        setExpanded(task.subRows, currentDepth + 1, rowId);
      }
    });
  };

  const treeData = buildTree(tasks);
  setExpanded(treeData);

  return expanded;
}

export function getAllExpandableTaskIds(tasks: ERPNextTaskForUser[]): string[] {
  const expandableIds: string[] = [];

  // 자식이 있는 모든 태스크 찾기
  tasks.forEach((task) => {
    const hasChildren = tasks.some((t) => t.parent_task === task.name);
    if (hasChildren) {
      expandableIds.push(task.name);
    }
  });

  return expandableIds;
}
