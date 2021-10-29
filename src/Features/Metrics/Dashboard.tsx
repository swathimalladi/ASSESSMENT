import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { actions } from '../Metrics/reducer';
import { Provider, createClient, useQuery } from 'urql';
import Select from 'react-dropdown-select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
  query {
    getMetrics 
      __typename
  }
`;

const mQuery = `
query ($input: [MeasurementQuery]) {
  getMultipleMeasurements(input: $input) {
    metric
    measurements {
      at
      value
      metric
      unit
    __typename }  
    __typename
}
  __typename
}`;

export default () => {
  return (
    <Provider value={client}>
      <Metrics />
    </Provider>
  );
};

type MetricTypes = string;

type KeyValue = {
  label: string;
  value: string;
};

type InputTypes = {
  metricName: string;
  after: string;
};

const Metrics = () => {
  const [result] = useQuery({
    query,
    variables: {},
  });
  const dispatch = useDispatch();
  let myarray: KeyValue[] = new Array<KeyValue>();
  const { fetching, data, error } = result;
  const [selectedMetrics, setSelectedMetrics] = useState<any[]>([]);
  let input: InputTypes[] = new Array<InputTypes>();

  useEffect(() => {
    if (error) {
      dispatch(actions.metricsApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMetrics } = data;
    dispatch(actions.metricsDataRecevied(getMetrics));
  }, [dispatch, data, error]);

  selectedMetrics.map((val: KeyValue) => {
    input.push({ metricName: val?.label, after: '1614576581739' });
  });

  const [metricResult] = useQuery({
    query: mQuery,
    variables: {
      input,
    },
  });
  const selectedMetricsResults = (metricResult.data && metricResult.data.getMultipleMeasurements) || [];

  if (result.data && result.data.getMetrics) {
    result.data.getMetrics.map((val: MetricTypes) => {
      myarray.push({ label: val, value: val });
    });
  }

  return (
    <>
      {result.data && result.data.getMetrics ? (
        <Select
          options={myarray}
          values={[]}
          required
          multi
          name="select"
          onChange={(value: React.SetStateAction<any[]>) => setSelectedMetrics(value)}
        />
      ) : null}

      {(selectedMetricsResults || []).length > 0 && (
        <div style={{ display: 'inline' }}>
          {' '}
          charts
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={selectedMetricsResults[0].measurements.slice(0, 50)}
              margin={{
                top: 20,
                right: 50,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <ReferenceLine x="Page C" stroke="red" label="Max PV PAGE" />
              <ReferenceLine y={9800} label="Max" stroke="red" />

              <Line type="monotone" dataKey="value" stroke="#8884d8" />
              <Line type="monotone" dataKey="value2" stroke="#8884d8" />
              <Line type="monotone" dataKey="value3" stroke="#8884d8" />

              {/* {displayLineChart()} */}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
};
