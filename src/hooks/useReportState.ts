import { useReducer } from 'react';
import type {
  ReportInput,
  RbcStatus,
  RbcSize,
  RbcChromia,
  WbcCountCategory,
  DifferentialType,
  PlateletCount,
  InterpretationKey,
  AmountType,
} from '../types';

export type ReportAction =
  | { type: 'SET_DATE'; value: string }
  | { type: 'SET_CASE_ID'; value: string }
  | { type: 'SET_SIGNING_PATHOLOGIST'; value: string }
  | { type: 'SET_BILLING_CODE_1'; value: string }
  | { type: 'SET_BILLING_CODE_2'; value: string }
  | { type: 'SET_HAS_ABNORMALITIES'; value: boolean }
  | { type: 'SET_RBC_STATUS'; value: RbcStatus }
  | { type: 'SET_RBC_SIZE'; value: RbcSize }
  | { type: 'SET_RBC_CHROMIA'; value: RbcChromia }
  | { type: 'TOGGLE_RBC_ADDITIONAL'; field: 'anisocytosis' | 'poikilocytosis' | 'schistocytes' | 'tearDropCells' | 'targetCells' | 'elliptocytes' }
  | { type: 'SET_RBC_OTHER_TEXT'; value: string }
  | { type: 'TOGGLE_NRBC_INCREASED' }
  | { type: 'TOGGLE_RETICULOCYTOSIS' }
  | { type: 'SET_WBC_COUNT'; value: WbcCountCategory }
  | { type: 'TOGGLE_DIFFERENTIAL'; diffType: DifferentialType }
  | { type: 'TOGGLE_DIFFERENTIAL_QUALIFIER'; diffType: DifferentialType; qualifier: 'absolute' | 'relative' }
  | { type: 'ADD_ABNORMAL_ENTRY' }
  | { type: 'REMOVE_ABNORMAL_ENTRY'; index: number }
  | { type: 'SET_ABNORMAL_AMOUNT_TYPE'; index: number; amountType: AmountType }
  | { type: 'SET_ABNORMAL_AMOUNT_VALUE'; index: number; value: string }
  | { type: 'SET_ABNORMAL_POPULATION_TYPE'; index: number; value: string }
  | { type: 'SET_PLATELET_COUNT'; value: PlateletCount }
  | { type: 'TOGGLE_LARGE_PLATELETS' }
  | { type: 'TOGGLE_PLATELET_CLUMPS' }
  | { type: 'TOGGLE_INTERPRETATION'; key: InterpretationKey }
  | { type: 'RESET' };

export function createInitialState(): ReportInput {
  return {
    metadata: { date: new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' }), caseId: '', signingPathologist: '', billingCode1: '85060', billingCode2: 'R68.89' },
    hasAbnormalities: null,
    rbc: {
      status: null,
      size: null,
      chromia: null,
      additional: {
        anisocytosis: false,
        poikilocytosis: false,
        schistocytes: false,
        tearDropCells: false,
        targetCells: false,
        elliptocytes: false,
        otherText: '',
      },
    },
    nrbc: { increasedNucleatedRbcs: false, reticulocytosis: false },
    wbc: { countCategory: null, leftShift: false, differentials: [] },
    abnormalPopulations: { entries: [] },
    platelets: { count: null, largePlatelets: false, plateletClumps: false },
    interpretations: { selected: [] },
  };
}

function clearAbnormalities(state: ReportInput): ReportInput {
  const initial = createInitialState();
  return {
    ...state,
    rbc: initial.rbc,
    nrbc: initial.nrbc,
    wbc: initial.wbc,
    abnormalPopulations: initial.abnormalPopulations,
    platelets: initial.platelets,
    interpretations: initial.interpretations,
  };
}

function reportReducer(state: ReportInput, action: ReportAction): ReportInput {
  switch (action.type) {
    case 'SET_DATE':
      return { ...state, metadata: { ...state.metadata, date: action.value } };
    case 'SET_CASE_ID':
      return { ...state, metadata: { ...state.metadata, caseId: action.value } };
    case 'SET_SIGNING_PATHOLOGIST':
      return { ...state, metadata: { ...state.metadata, signingPathologist: action.value } };
    case 'SET_BILLING_CODE_1':
      return { ...state, metadata: { ...state.metadata, billingCode1: action.value } };
    case 'SET_BILLING_CODE_2':
      return { ...state, metadata: { ...state.metadata, billingCode2: action.value } };

    case 'SET_HAS_ABNORMALITIES':
      if (action.value === false) {
        return clearAbnormalities({ ...state, hasAbnormalities: false });
      }
      return { ...state, hasAbnormalities: action.value };

    case 'SET_RBC_STATUS':
      return { ...state, rbc: { ...state.rbc, status: action.value } };
    case 'SET_RBC_SIZE':
      return { ...state, rbc: { ...state.rbc, size: action.value } };
    case 'SET_RBC_CHROMIA':
      return { ...state, rbc: { ...state.rbc, chromia: action.value } };
    case 'TOGGLE_RBC_ADDITIONAL':
      return {
        ...state,
        rbc: {
          ...state.rbc,
          additional: {
            ...state.rbc.additional,
            [action.field]: !(state.rbc.additional[action.field] as boolean),
          },
        },
      };
    case 'SET_RBC_OTHER_TEXT':
      return {
        ...state,
        rbc: {
          ...state.rbc,
          additional: { ...state.rbc.additional, otherText: action.value },
        },
      };

    case 'TOGGLE_NRBC_INCREASED':
      return {
        ...state,
        nrbc: { ...state.nrbc, increasedNucleatedRbcs: !state.nrbc.increasedNucleatedRbcs },
      };
    case 'TOGGLE_RETICULOCYTOSIS':
      return {
        ...state,
        nrbc: { ...state.nrbc, reticulocytosis: !state.nrbc.reticulocytosis },
      };

    case 'SET_WBC_COUNT':
      return { ...state, wbc: { ...state.wbc, countCategory: action.value } };
    case 'TOGGLE_DIFFERENTIAL': {
      const exists = state.wbc.differentials.find((d) => d.type === action.diffType);
      if (exists) {
        return {
          ...state,
          wbc: {
            ...state.wbc,
            differentials: state.wbc.differentials.filter((d) => d.type !== action.diffType),
          },
        };
      }
      return {
        ...state,
        wbc: {
          ...state.wbc,
          differentials: [
            ...state.wbc.differentials,
            { type: action.diffType, absolute: false, relative: false },
          ],
        },
      };
    }
    case 'TOGGLE_DIFFERENTIAL_QUALIFIER': {
      return {
        ...state,
        wbc: {
          ...state.wbc,
          differentials: state.wbc.differentials.map((d) =>
            d.type === action.diffType
              ? { ...d, [action.qualifier]: !d[action.qualifier] }
              : d
          ),
        },
      };
    }

    case 'ADD_ABNORMAL_ENTRY':
      return {
        ...state,
        abnormalPopulations: {
          entries: [
            ...state.abnormalPopulations.entries,
            { amountType: 'qualitative', amountValue: '', populationType: '', neutrophilMorphologies: [] },
          ],
        },
      };
    case 'REMOVE_ABNORMAL_ENTRY':
      return {
        ...state,
        abnormalPopulations: {
          entries: state.abnormalPopulations.entries.filter((_, i) => i !== action.index),
        },
      };
    case 'SET_ABNORMAL_AMOUNT_TYPE':
      return {
        ...state,
        abnormalPopulations: {
          entries: state.abnormalPopulations.entries.map((e, i) =>
            i === action.index ? { ...e, amountType: action.amountType, amountValue: '' } : e
          ),
        },
      };
    case 'SET_ABNORMAL_AMOUNT_VALUE':
      return {
        ...state,
        abnormalPopulations: {
          entries: state.abnormalPopulations.entries.map((e, i) =>
            i === action.index ? { ...e, amountValue: action.value } : e
          ),
        },
      };
    case 'SET_ABNORMAL_POPULATION_TYPE':
      return {
        ...state,
        abnormalPopulations: {
          entries: state.abnormalPopulations.entries.map((e, i) =>
            i === action.index ? { ...e, populationType: action.value } : e
          ),
        },
      };

    case 'SET_PLATELET_COUNT':
      return { ...state, platelets: { ...state.platelets, count: action.value } };
    case 'TOGGLE_LARGE_PLATELETS':
      return { ...state, platelets: { ...state.platelets, largePlatelets: !state.platelets.largePlatelets } };
    case 'TOGGLE_PLATELET_CLUMPS':
      return { ...state, platelets: { ...state.platelets, plateletClumps: !state.platelets.plateletClumps } };

    case 'TOGGLE_INTERPRETATION': {
      const selected = state.interpretations.selected;
      const isSelected = selected.includes(action.key);
      return {
        ...state,
        interpretations: {
          selected: isSelected
            ? selected.filter((k) => k !== action.key)
            : [...selected, action.key],
        },
      };
    }

    case 'RESET':
      return createInitialState();

    default:
      return state;
  }
}

export function useReportState() {
  const [state, dispatch] = useReducer(reportReducer, undefined, createInitialState);
  return { state, dispatch };
}
