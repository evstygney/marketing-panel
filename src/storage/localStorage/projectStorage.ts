import { ProjectState } from "entities/types";
import { emptyState } from "shared/constants/defaults";
import { PROJECT_STORAGE_KEY } from "./keys";

export const loadProjectState = (): ProjectState => {
  try {
    const raw = localStorage.getItem(PROJECT_STORAGE_KEY);
    if (!raw) {
      return emptyState;
    }

    const parsed = JSON.parse(raw) as ProjectState;
    return {
      ...emptyState,
      ...parsed,
      settings: {
        ...emptyState.settings,
        ...parsed.settings,
      },
    };
  } catch {
    return emptyState;
  }
};

export const saveProjectState = (state: ProjectState) => {
  localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(state));
};

export const clearProjectState = () => {
  localStorage.removeItem(PROJECT_STORAGE_KEY);
};
