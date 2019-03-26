import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Grid from './Grid';

export class EmailLayout {
    static emailForm(month, schedules) {
        return ReactDOMServer.renderToStaticMarkup(
            <Grid>
                <h1>Informações do Mês {month}</h1>
                <Grid.Row>
                    {schedules}
                </Grid.Row>
            </Grid>
        );
    }
}
