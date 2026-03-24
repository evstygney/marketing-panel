import { createContext, ReactNode, useContext, useEffect, useMemo, useReducer } from "react";
import { Channel, ChannelMetricKey, DiagnosticThresholds, Hypothesis, ProjectState } from "entities/types";
import { demoState, emptyState } from "shared/constants/defaults";
import { clearProjectState, loadProjectState, saveProjectState } from "storage/localStorage/projectStorage";

type StateContextValue = {
  state: ProjectState;
  actions: {
    updateChannel: (period: "periodCurrent" | "periodPrevious", channelName: string, field: ChannelMetricKey, value: number) => void;
    replacePeriodChannels: (period: "periodCurrent" | "periodPrevious", channels: Channel[]) => void;
    importState: (nextState: ProjectState) => void;
    resetState: () => void;
    loadDemoState: () => void;
    updateHypothesis: (hypothesis: Hypothesis) => void;
    createHypothesis: (hypothesis: Hypothesis) => void;
    deleteHypothesis: (id: string) => void;
    completeOnboarding: () => void;
    updateDiagnosticThreshold: <K extends keyof DiagnosticThresholds>(key: K, value: DiagnosticThresholds[K]) => void;
  };
};

type Action =
  | { type: "UPDATE_CHANNEL"; payload: { period: "periodCurrent" | "periodPrevious"; channelName: string; field: ChannelMetricKey; value: number } }
  | { type: "REPLACE_PERIOD_CHANNELS"; payload: { period: "periodCurrent" | "periodPrevious"; channels: Channel[] } }
  | { type: "IMPORT_STATE"; payload: ProjectState }
  | { type: "RESET_STATE" }
  | { type: "LOAD_DEMO_STATE" }
  | { type: "UPDATE_HYPOTHESIS"; payload: Hypothesis }
  | { type: "CREATE_HYPOTHESIS"; payload: Hypothesis }
  | { type: "DELETE_HYPOTHESIS"; payload: string }
  | { type: "COMPLETE_ONBOARDING" }
  | { type: "UPDATE_DIAGNOSTIC_THRESHOLD"; payload: { key: keyof DiagnosticThresholds; value: number } };

const MarketingStoreContext = createContext<StateContextValue | null>(null);

const updateChannelList = (
  channels: Channel[],
  channelName: string,
  field: ChannelMetricKey,
  value: number,
): Channel[] =>
  channels.map((channel) =>
    channel.name === channelName
      ? {
          ...channel,
          [field]: value,
        }
      : channel,
  );

const reducer = (state: ProjectState, action: Action): ProjectState => {
  switch (action.type) {
    case "UPDATE_CHANNEL":
      return {
        ...state,
        [action.payload.period]: updateChannelList(
          state[action.payload.period],
          action.payload.channelName,
          action.payload.field,
          action.payload.value,
        ),
      };
    case "IMPORT_STATE":
      return action.payload;
    case "REPLACE_PERIOD_CHANNELS":
      return {
        ...state,
        [action.payload.period]: action.payload.channels,
      };
    case "RESET_STATE":
      return emptyState;
    case "LOAD_DEMO_STATE":
      return {
        ...demoState,
        settings: {
          ...demoState.settings,
          onboardingCompleted: true,
        },
      };
    case "UPDATE_HYPOTHESIS":
      return {
        ...state,
        hypotheses: state.hypotheses.map((item) => (item.id === action.payload.id ? action.payload : item)),
      };
    case "CREATE_HYPOTHESIS":
      return {
        ...state,
        hypotheses: [action.payload, ...state.hypotheses],
      };
    case "DELETE_HYPOTHESIS":
      return {
        ...state,
        hypotheses: state.hypotheses.filter((item) => item.id !== action.payload),
      };
    case "COMPLETE_ONBOARDING":
      return {
        ...state,
        settings: {
          ...state.settings,
          onboardingCompleted: true,
        },
      };
    case "UPDATE_DIAGNOSTIC_THRESHOLD":
      return {
        ...state,
        settings: {
          ...state.settings,
          diagnosticThresholds: {
            ...state.settings.diagnosticThresholds,
            [action.payload.key]: action.payload.value,
          },
        },
      };
    default:
      return state;
  }
};

export const MarketingStoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, undefined, loadProjectState);

  useEffect(() => {
    saveProjectState(state);
  }, [state]);

  const value = useMemo<StateContextValue>(
    () => ({
      state,
      actions: {
        updateChannel: (period, channelName, field, value) =>
          dispatch({ type: "UPDATE_CHANNEL", payload: { period, channelName, field, value } }),
        replacePeriodChannels: (period, channels) =>
          dispatch({ type: "REPLACE_PERIOD_CHANNELS", payload: { period, channels } }),
        importState: (nextState) => dispatch({ type: "IMPORT_STATE", payload: nextState }),
        resetState: () => {
          clearProjectState();
          dispatch({ type: "RESET_STATE" });
        },
        loadDemoState: () => dispatch({ type: "LOAD_DEMO_STATE" }),
        updateHypothesis: (hypothesis) => dispatch({ type: "UPDATE_HYPOTHESIS", payload: hypothesis }),
        createHypothesis: (hypothesis) => dispatch({ type: "CREATE_HYPOTHESIS", payload: hypothesis }),
        deleteHypothesis: (id) => dispatch({ type: "DELETE_HYPOTHESIS", payload: id }),
        completeOnboarding: () => dispatch({ type: "COMPLETE_ONBOARDING" }),
        updateDiagnosticThreshold: (key, value) =>
          dispatch({ type: "UPDATE_DIAGNOSTIC_THRESHOLD", payload: { key, value } }),
      },
    }),
    [state],
  );

  return <MarketingStoreContext.Provider value={value}>{children}</MarketingStoreContext.Provider>;
};

export const useMarketingStore = () => {
  const context = useContext(MarketingStoreContext);
  if (!context) {
    throw new Error("useMarketingStore must be used within MarketingStoreProvider");
  }

  return context;
};
