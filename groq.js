export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { prompt, apiKey } = req.body;
    if (!apiKey) return res.status(400).json({ error: 'API Key is required' });
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.5
            })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || 'Groq API Error');
        return res.status(200).json({ content: data.choices[0].message.content });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
