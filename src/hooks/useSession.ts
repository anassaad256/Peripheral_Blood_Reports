import { useReducer, useEffect, useCallback } from 'react';
import type { Session, CaseData } from '../types';
import type {
  RbcStatus, RbcSize, RbcChromia,
  WbcCountCategory, DifferentialType, PlateletCount,
  InterpretationKey, AmountType, NeutrophilMorphology,
} from '../types';

const STORAGE_KEY = 'pbs-session';

function getEstDate(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

export function createEmptyCase(): CaseData {
  return {
    id: crypto.randomUUID(),
    caseId: '',
    hasAbnormalities: null,
    rbc: {
      status: null, size: null, chromia: null,
      additional: { anisocytosis: false, poikilocytosis: false, schistocytes: false, tearDropCells: false, targetCells: false, elliptocytes: false, otherText: '' },
    },
    nrbc: { increasedNucleatedRbcs: false, reticulocytosis: false },
    wbc: { countCategory: null, leftShift: false, differentials: [] },
    abnormalPopulations: { entries: [] },
    platelets: { count: null, largePlatelets: false, plateletClumps: false },
    interpretations: { selected: ['clinical_correlation'] },
    generatedReport: null,
  };
}

function createDefaultSession(): Session {
  return {
    metadata: {
      date: getEstDate(),
      signingPathologist: '',
      billingCode1: '85060',
      billingCode2: 'R68.89',
    },
    cases: [createEmptyCase()],
    activeCaseIndex: 0,
    view: 'editing',
  };
}

export type SessionAction =
  // Session metadata
  | { type: 'SET_SESSION_DATE'; value: string }
  | { type: 'SET_SESSION_PATHOLOGIST'; value: string }
  | { type: 'SET_SESSION_BILL1'; value: string }
  | { type: 'SET_SESSION_BILL2'; value: string }
  // Session flow
  | { type: 'START_NEW_SESSION' }
  | { type: 'RESUME_SESSION' }
  | { type: 'ADD_CASE' }
  | { type: 'DELETE_CASE'; index: number }
  | { type: 'SELECT_CASE'; index: number }
  | { type: 'RESET_CASE' }
  | { type: 'SET_VIEW'; view: 'editing' | 'summary' }
  // Case ID
  | { type: 'SET_CASE_ID'; value: string }
  // Case-level actions (operate on active case)
  | { type: 'SET_HAS_ABNORMALITIES'; value: boolean }
  | { type: 'SET_RBC_STATUS'; value: RbcStatus }
  | { type: 'SET_RBC_SIZE'; value: RbcSize }
  | { type: 'SET_RBC_CHROMIA'; value: RbcChromia }
  | { type: 'TOGGLE_RBC_ADDITIONAL'; field: 'anisocytosis' | 'poikilocytosis' | 'schistocytes' | 'tearDropCells' | 'targetCells' | 'elliptocytes' }
  | { type: 'SET_RBC_OTHER_TEXT'; value: string }
  | { type: 'TOGGLE_NRBC_INCREASED' }
  | { type: 'TOGGLE_RETICULOCYTOSIS' }
  | { type: 'TOGGLE_WBC_LEFT_SHIFT' }
  | { type: 'SET_WBC_COUNT'; value: WbcCountCategory }
  | { type: 'TOGGLE_DIFFERENTIAL'; diffType: DifferentialType }
  | { type: 'TOGGLE_DIFFERENTIAL_QUALIFIER'; diffType: DifferentialType; qualifier: 'absolute' | 'relative' }
  | { type: 'ADD_ABNORMAL_ENTRY' }
  | { type: 'REMOVE_ABNORMAL_ENTRY'; index: number }
  | { type: 'SET_ABNORMAL_AMOUNT_TYPE'; index: number; amountType: AmountType }
  | { type: 'SET_ABNORMAL_AMOUNT_VALUE'; index: number; value: string }
  | { type: 'SET_ABNORMAL_POPULATION_TYPE'; index: number; value: string }
  | { type: 'TOGGLE_NEUTROPHIL_MORPHOLOGY'; index: number; morphology: NeutrophilMorphology }
  | { type: 'SET_PLATELET_COUNT'; value: PlateletCount }
  | { type: 'TOGGLE_LARGE_PLATELETS' }
  | { type: 'TOGGLE_PLATELET_CLUMPS' }
  | { type: 'TOGGLE_INTERPRETATION'; key: InterpretationKey }
  // Report
  | { type: 'SET_GENERATED_REPORT'; text: string };

function updateActiveCase(state: Session, updater: (c: CaseData) => CaseData): Session {
  const cases = [...state.cases];
  cases[state.activeCaseIndex] = updater(cases[state.activeCaseIndex]);
  return { ...state, cases };
}

function clearCaseAbnormalities(c: CaseData): CaseData {
  const empty = createEmptyCase();
  return {
    ...c,
    rbc: empty.rbc,
    nrbc: empty.nrbc,
    wbc: empty.wbc,
    abnormalPopulations: empty.abnormalPopulations,
    platelets: empty.platelets,
    interpretations: empty.interpretations,
  };
}

function sessionReducer(state: Session, action: SessionAction): Session {
  switch (action.type) {
    // Session metadata
    case 'SET_SESSION_DATE':
      return { ...state, metadata: { ...state.metadata, date: action.value } };
    case 'SET_SESSION_PATHOLOGIST':
      return { ...state, metadata: { ...state.metadata, signingPathologist: action.value } };
    case 'SET_SESSION_BILL1':
      return { ...state, metadata: { ...state.metadata, billingCode1: action.value } };
    case 'SET_SESSION_BILL2':
      return { ...state, metadata: { ...state.metadata, billingCode2: action.value } };

    // Session flow
    case 'START_NEW_SESSION':
      return createDefaultSession();
    case 'RESUME_SESSION':
      return state; // no-op, already loaded
    case 'ADD_CASE': {
      const newCase = createEmptyCase();
      return { ...state, cases: [...state.cases, newCase], activeCaseIndex: state.cases.length, view: 'editing' };
    }
    case 'DELETE_CASE': {
      if (state.cases.length <= 1) return state; // keep at least one
      const cases = state.cases.filter((_, i) => i !== action.index);
      let newIndex = state.activeCaseIndex;
      if (action.index <= newIndex) newIndex = Math.max(0, newIndex - 1);
      return { ...state, cases, activeCaseIndex: newIndex };
    }
    case 'SELECT_CASE':
      return { ...state, activeCaseIndex: action.index, view: 'editing' };
    case 'RESET_CASE': {
      return updateActiveCase(state, (c) => ({ ...createEmptyCase(), id: c.id }));
    }
    case 'SET_VIEW':
      return { ...state, view: action.view };

    // Case ID
    case 'SET_CASE_ID':
      return updateActiveCase(state, (c) => ({ ...c, caseId: action.value }));

    // Abnormality gate
    case 'SET_HAS_ABNORMALITIES':
      return updateActiveCase(state, (c) => {
        if (action.value === false) return clearCaseAbnormalities({ ...c, hasAbnormalities: false });
        return { ...c, hasAbnormalities: action.value };
      });

    // RBC
    case 'SET_RBC_STATUS':
      return updateActiveCase(state, (c) => ({ ...c, rbc: { ...c.rbc, status: action.value } }));
    case 'SET_RBC_SIZE':
      return updateActiveCase(state, (c) => ({ ...c, rbc: { ...c.rbc, size: action.value } }));
    case 'SET_RBC_CHROMIA':
      return updateActiveCase(state, (c) => ({ ...c, rbc: { ...c.rbc, chromia: action.value } }));
    case 'TOGGLE_RBC_ADDITIONAL':
      return updateActiveCase(state, (c) => ({
        ...c,
        rbc: { ...c.rbc, additional: { ...c.rbc.additional, [action.field]: !c.rbc.additional[action.field] } },
      }));
    case 'SET_RBC_OTHER_TEXT':
      return updateActiveCase(state, (c) => ({
        ...c,
        rbc: { ...c.rbc, additional: { ...c.rbc.additional, otherText: action.value } },
      }));

    // NRBC
    case 'TOGGLE_NRBC_INCREASED':
      return updateActiveCase(state, (c) => ({
        ...c, nrbc: { ...c.nrbc, increasedNucleatedRbcs: !c.nrbc.increasedNucleatedRbcs },
      }));
    case 'TOGGLE_RETICULOCYTOSIS':
      return updateActiveCase(state, (c) => ({
        ...c, nrbc: { ...c.nrbc, reticulocytosis: !c.nrbc.reticulocytosis },
      }));

    // WBC
    case 'SET_WBC_COUNT':
      return updateActiveCase(state, (c) => ({ ...c, wbc: { ...c.wbc, countCategory: action.value } }));
    case 'TOGGLE_WBC_LEFT_SHIFT':
      return updateActiveCase(state, (c) => ({ ...c, wbc: { ...c.wbc, leftShift: !c.wbc.leftShift } }));
    case 'TOGGLE_DIFFERENTIAL': {
      return updateActiveCase(state, (c) => {
        const exists = c.wbc.differentials.find((d) => d.type === action.diffType);
        if (exists) {
          return { ...c, wbc: { ...c.wbc, differentials: c.wbc.differentials.filter((d) => d.type !== action.diffType) } };
        }
        return { ...c, wbc: { ...c.wbc, differentials: [...c.wbc.differentials, { type: action.diffType, absolute: false, relative: false }] } };
      });
    }
    case 'TOGGLE_DIFFERENTIAL_QUALIFIER':
      return updateActiveCase(state, (c) => ({
        ...c,
        wbc: {
          ...c.wbc,
          differentials: c.wbc.differentials.map((d) =>
            d.type === action.diffType ? { ...d, [action.qualifier]: !d[action.qualifier] } : d
          ),
        },
      }));

    // Abnormal populations
    case 'ADD_ABNORMAL_ENTRY':
      return updateActiveCase(state, (c) => ({
        ...c,
        abnormalPopulations: { entries: [...c.abnormalPopulations.entries, { amountType: 'qualitative', amountValue: '', populationType: '', neutrophilMorphologies: [] }] },
      }));
    case 'REMOVE_ABNORMAL_ENTRY':
      return updateActiveCase(state, (c) => ({
        ...c,
        abnormalPopulations: { entries: c.abnormalPopulations.entries.filter((_, i) => i !== action.index) },
      }));
    case 'SET_ABNORMAL_AMOUNT_TYPE':
      return updateActiveCase(state, (c) => ({
        ...c,
        abnormalPopulations: {
          entries: c.abnormalPopulations.entries.map((e, i) =>
            i === action.index ? { ...e, amountType: action.amountType, amountValue: '' } : e
          ),
        },
      }));
    case 'SET_ABNORMAL_AMOUNT_VALUE':
      return updateActiveCase(state, (c) => ({
        ...c,
        abnormalPopulations: {
          entries: c.abnormalPopulations.entries.map((e, i) =>
            i === action.index ? { ...e, amountValue: action.value } : e
          ),
        },
      }));
    case 'SET_ABNORMAL_POPULATION_TYPE':
      return updateActiveCase(state, (c) => ({
        ...c,
        abnormalPopulations: {
          entries: c.abnormalPopulations.entries.map((e, i) =>
            i === action.index ? { ...e, populationType: action.value, neutrophilMorphologies: action.value === 'neutrophils' ? e.neutrophilMorphologies : [] } : e
          ),
        },
      }));
    case 'TOGGLE_NEUTROPHIL_MORPHOLOGY':
      return updateActiveCase(state, (c) => ({
        ...c,
        abnormalPopulations: {
          entries: c.abnormalPopulations.entries.map((e, i) => {
            if (i !== action.index) return e;
            const has = e.neutrophilMorphologies.includes(action.morphology);
            return {
              ...e,
              neutrophilMorphologies: has
                ? e.neutrophilMorphologies.filter((m) => m !== action.morphology)
                : [...e.neutrophilMorphologies, action.morphology],
            };
          }),
        },
      }));

    // Platelets
    case 'SET_PLATELET_COUNT':
      return updateActiveCase(state, (c) => ({ ...c, platelets: { ...c.platelets, count: action.value } }));
    case 'TOGGLE_LARGE_PLATELETS':
      return updateActiveCase(state, (c) => ({ ...c, platelets: { ...c.platelets, largePlatelets: !c.platelets.largePlatelets } }));
    case 'TOGGLE_PLATELET_CLUMPS':
      return updateActiveCase(state, (c) => ({ ...c, platelets: { ...c.platelets, plateletClumps: !c.platelets.plateletClumps } }));

    // Interpretations
    case 'TOGGLE_INTERPRETATION': {
      return updateActiveCase(state, (c) => {
        const sel = c.interpretations.selected;
        const has = sel.includes(action.key);
        return { ...c, interpretations: { selected: has ? sel.filter((k) => k !== action.key) : [...sel, action.key] } };
      });
    }

    // Report
    case 'SET_GENERATED_REPORT':
      return updateActiveCase(state, (c) => ({ ...c, generatedReport: action.text }));

    default:
      return state;
  }
}

function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

function saveSession(session: Session) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch { /* ignore quota errors */ }
}

export function hasSavedSession(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null;
}

export function useSession() {
  const [state, dispatch] = useReducer(
    sessionReducer,
    undefined,
    () => loadSession() ?? createDefaultSession(),
  );

  // Persist on every change
  useEffect(() => {
    saveSession(state);
  }, [state]);

  const clearSaved = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { state, dispatch, clearSaved };
}
