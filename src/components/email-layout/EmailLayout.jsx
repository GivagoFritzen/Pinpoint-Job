import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from './Grid';

export class EmailLayout extends Component {
    static propTypes = {
        month: PropTypes.string.isRequired,
    }

    render() {
        const { month } = this.props

        return (
            <Grid>
                <h1>Informações do Mês {month}</h1>
                <Grid.Row>
                    <p>Teste</p>
                </Grid.Row>
            </Grid>
        );
    }
}
