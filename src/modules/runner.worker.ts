const optimize = (result: unknown): string | undefined => {
  if (result === null) return JSON.stringify(null);

  switch (typeof result) {
    case 'string':
    case 'number':
    case 'bigint':
    case 'boolean':
      return JSON.stringify(result);
    case 'undefined':
      return 'undefined';
    default:
      return JSON.stringify(String(result));
  }
};

self.addEventListener('message', ({ data }) => {
  if (typeof data !== 'string') return;

  let result: unknown;

  try {
    // @ts-expect-error
    console.answer = (data: unknown) => {
      result = data;

      console.dir(data);
    };
    eval(data);

    self.postMessage({ success: true, body: optimize(result) });
  } catch (err) {
    self.postMessage({ success: false, body: String(err) });
  }
});

export default {};
