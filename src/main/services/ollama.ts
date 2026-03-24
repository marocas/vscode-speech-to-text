export async function getOllamaModelNames(baseUrl: string): Promise<string[]> {
  const normalizedBaseUrl = baseUrl.trim().replace(/\/+$/, '');
  if (!normalizedBaseUrl) {
    return [];
  }

  const response = await fetch(`${normalizedBaseUrl}/api/tags`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Failed to query Ollama models at ${normalizedBaseUrl}`);
  }

  const data = (await response.json()) as { models?: Array<{ name?: string }> };
  return (data.models || [])
    .map((item) => item.name?.trim())
    .filter((name): name is string => Boolean(name));
}

export async function downloadOllamaModel(baseUrl: string, model: string): Promise<void> {
  const normalizedBaseUrl = baseUrl.trim().replace(/\/+$/, '');
  const normalizedModel = model.trim();

  if (!normalizedBaseUrl) {
    throw new Error('Ollama base URL is required.');
  }

  if (!normalizedModel) {
    throw new Error('Model name is required.');
  }

  const response = await fetch(`${normalizedBaseUrl}/api/pull`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: normalizedModel,
      stream: false,
    }),
  });

  if (!response.ok) {
    let detail = '';
    try {
      const payload = (await response.json()) as { error?: string };
      detail = payload.error ? ` ${payload.error}` : '';
    } catch {
      // Ignore body parsing errors and fallback to status text.
    }

    throw new Error(
      `Failed to download model \"${normalizedModel}\" from Ollama (${response.status}).${detail}`
    );
  }
}
