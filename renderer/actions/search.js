export const QUERY_REPLACE = 'QUERY_REPLACE';
export const QUERY_APPEND = 'QUERY_APPEND';
export const RESULTS_LOADING = 'RESULTS_LOADING';
export const RESULTS_LOADED = 'RESULTS_LOADED';
export const RESULTS_ERROR = 'RESULTS_ERROR';
export const SELECT_RESULT = 'SELECT_RESULT';
export const PANEL_LOADING = 'PANEL_LOADING';
export const PANEL_PUSH = 'PANEL_PUSH';
export const PANEL_POP = 'PANEL_POP';
export const PANEL_POP_ALL = 'PANEL_POP_ALL';

import { fetchResults } from '../utils/api.js';

export function loadSuggestions() {
    return function(dispatch, getState) {
        if (getState().search.query) {
            dispatch({
                type: QUERY_REPLACE,
                query: ''
            });
        }

        dispatch(loadResults());
    };
}

export function replaceQuery(query = null) {
    return function(dispatch, getState) {
        const state = getState();

        if (state.search.query == query) {
            return;
        }

        dispatch({
            type: QUERY_REPLACE,
            query
        });
    };
}

export function appendQuery(query) {
    return function(dispatch) {
        dispatch({
            type: QUERY_APPEND,
            query
        });
    };
}

export function loadResults() {
    return function(dispatch, getState) {
        const state = getState();

        dispatch({
            type: RESULTS_LOADING
        });

        fetchResults(state.search.query).then(results =>
            dispatch({
                type: RESULTS_LOADED,
                results
            })
        );
    };
}

export function selectResult(id) {
    return function(dispatch, getState) {
        dispatch({
            type: SELECT_RESULT,
            id
        });

        const results = getState().search.results;
        const panel = results.find(result => result.id === id);

        if (panel) {
            dispatch({
                type: PANEL_PUSH,
                panel
            });
        }
    };
}

export function back() {
    return function(dispatch, getState) {
        const search = getState().search;

        if (search.panels.length) {
            dispatch(popPanel());
        } else if (search.query) {
            dispatch(loadSuggestions());
        }
    };
}

export function popPanel() {
    return {
        type: PANEL_POP
    };
}
