import React from 'react';
import { HeaderEditor } from '../components/HeaderEditor';
import { connect } from 'react-redux';
import * as editorActions from '../actions/editor';
import { RootState } from '../reducers';
import { bindActionCreators, Dispatch } from 'redux';
import { headerSelector } from '../selectors/editor';
import { currentMethodJsonSchema } from '../selectors/services';

function mapStateToProps(state: RootState) {
    return {
        value: headerSelector(state),
        jsonSchema: currentMethodJsonSchema(state)
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return bindActionCreators({
        onChange: editorActions.setHeader
    }, dispatch);
}

export const HeaderEditorContainer = connect(mapStateToProps, mapDispatchToProps)(HeaderEditor);
