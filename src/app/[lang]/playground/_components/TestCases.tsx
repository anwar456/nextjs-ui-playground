export type TestCase = {
  name: string;
  expected: unknown;
  // Runs the solution; a thrown error is shown as a failure instead of crashing the page.
  run: () => unknown;
};

type Outcome = { name: string; expected: string; actual: string; pass: boolean };

const show = (value: unknown) => JSON.stringify(value) ?? String(value);

function evaluate({ name, expected, run }: TestCase): Outcome {
  const want = show(expected);
  try {
    const got = show(run());
    return { name, expected: want, actual: got, pass: got === want };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { name, expected: want, actual: `threw: ${message}`, pass: false };
  }
}

// Table of test cases with a PASS / FAIL result for each. Compared by JSON
// text, which is enough for the plain data these exercises return.
export function TestCases({ caption, cases }: { caption: string; cases: TestCase[] }) {
  const outcomes = cases.map(evaluate);
  const passed = outcomes.filter((o) => o.pass).length;

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-card">
      <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3">
        <h3 className="text-sm font-semibold">{caption}</h3>
        <p
          role="status"
          className={`font-mono text-xs ${passed === outcomes.length ? "text-ok" : "text-bad"}`}
        >
          {passed}/{outcomes.length} passed
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead className="text-xs uppercase tracking-wide text-muted">
            <tr>
              <th scope="col" className="px-4 py-2 font-medium">Case</th>
              <th scope="col" className="px-4 py-2 font-medium">Expected</th>
              <th scope="col" className="px-4 py-2 font-medium">Actual</th>
              <th scope="col" className="px-4 py-2 font-medium">Result</th>
            </tr>
          </thead>
          <tbody className="align-top">
            {outcomes.map((o) => (
              <tr key={o.name} className="border-t border-line">
                <th scope="row" className="px-4 py-2 font-normal">{o.name}</th>
                <td className="px-4 py-2 font-mono text-xs break-all text-muted">{o.expected}</td>
                <td className="px-4 py-2 font-mono text-xs break-all text-muted">{o.actual}</td>
                <td
                  className={`px-4 py-2 font-mono text-xs font-semibold ${o.pass ? "text-ok" : "text-bad"}`}
                >
                  {o.pass ? "PASS" : "FAIL"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
