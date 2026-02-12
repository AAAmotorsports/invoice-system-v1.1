// api/process-delivery-note.js
import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageBase64, mimeType } = req.body;

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType,
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: `この画像は納品書です。商品情報を抽出してください。

必ず以下のJSON形式のみを返してください。説明文や前置きは一切不要です。

{
  "items": [
    {
      "name": "商品名",
      "quantity": 数量,
      "unitPrice": 単価
    }
  ]
}

- nameは商品の名称（文字列）
- quantityは数量（数値）
- unitPriceは単価（数値）
- 必ず有効なJSON形式で返してください
- 複数の商品がある場合はすべて抽出してください`,
            },
          ],
        },
      ],
    });

    const textContent = message.content
      .filter((c) => c.type === 'text')
      .map((c) => c.text)
      .join('');

    // Extract JSON from response
    let jsonText = textContent.trim();
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');

    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('JSON形式のデータが見つかりませんでした');
    }

    const data = JSON.parse(jsonMatch[0]);

    if (!data.items || !Array.isArray(data.items)) {
      throw new Error('商品データの形式が正しくありません');
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('処理エラー:', error);
    return res.status(500).json({ error: error.message });
  }
}
