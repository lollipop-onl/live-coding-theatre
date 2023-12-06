const optimize = (result: unknown): string | undefined => {
  if (result === null) return JSON.stringify(null);
  if (typeof result === 'undefined') return 'undefined';

  try {
    return JSON.stringify(result);
  } catch {
    return JSON.stringify(String(result));
  }
};

self.addEventListener('message', ({ data }) => {
  if (!data || typeof data !== 'object') return;
  if (typeof data.code !== 'string') return;

  let result: unknown;

  try {
    const _value = data.value;
    const postAnswer = (data: unknown) => {
      result = data;

      console.dir(data);
    };
    eval(data.code);

    self.postMessage({ success: true, body: optimize(result) });
  } catch (err) {
    console.error(err);
    
    self.postMessage({ success: false, body: String(err) });
  }
});

export default {};
