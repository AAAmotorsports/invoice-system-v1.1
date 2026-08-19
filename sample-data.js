/* ===================================================
   DEMO 版サンプルデータ
   （架空のショップ・顧客・商品・請求書）
   =================================================== */

function loadDemoSampleData() {
  // 会社情報
  const settings = {
    companyName: 'サンプル自動車ショップ',
    representativeName: 'デモ 太郎',
    postalCode: '100-0001',
    address: '東京都千代田区サンプル1-2-3',
    registrationNumber: 'T0000000000000',
    taxRate: 10,
    logoImage: '',
    anthropicApiKey: '',
    masterCategories: [
      'エンジン部品',
      'フレーム部品',
      'ケミカル',
      'フォルツァ（エンジン外注）',
      'アパレル',
      'タイヤ',
      'サービス'
    ],
    bankAccounts: [
      { id: '1', bankName: 'サンプル銀行', branchName: '本店', accountType: '普通', accountNumber: '1234567', accountHolder: 'ｻﾝﾌﾟﾙｼﾞﾄﾞｳｼｬｼｮｯﾌﾟ' }
    ]
  };
  localStorage.setItem('invoice_sys_settings', JSON.stringify(settings));

  // 顧客
  const customers = ['田中 一郎', '佐藤 花子', '鈴木 健太', '高橋 美咲', '山本 大輔'];
  localStorage.setItem('invoice_sys_customers', JSON.stringify(customers));

  // 在庫商品
  const inventory = [
    { id: 'i1', name: 'スパークプラグ NGK-01', category: 'エンジン部品', quantity: 12, unit: '個', unitPrice: 800, retailPrice: 1400 },
    { id: 'i2', name: 'エアフィルター AF-100', category: 'エンジン部品', quantity: 8, unit: '個', unitPrice: 1200, retailPrice: 2000 },
    { id: 'i3', name: 'キャブレター O/H キット', category: 'エンジン部品', quantity: 3, unit: 'set', unitPrice: 4500, retailPrice: 7500 },
    { id: 'i4', name: 'フロントフォーク FF-25', category: 'フレーム部品', quantity: 4, unit: '本', unitPrice: 8000, retailPrice: 13000 },
    { id: 'i5', name: 'ステアリングロッド', category: 'フレーム部品', quantity: 6, unit: '本', unitPrice: 3200, retailPrice: 5500 },
    { id: 'i6', name: 'エンジンオイル 5W-30', category: 'ケミカル', quantity: 20, unit: '本', unitPrice: 1500, retailPrice: 2500 },
    { id: 'i7', name: 'ブレーキクリーナー', category: 'ケミカル', quantity: 15, unit: '本', unitPrice: 600, retailPrice: 1000 },
    { id: 'i8', name: 'チェーンルブ', category: 'ケミカル', quantity: 10, unit: '本', unitPrice: 800, retailPrice: 1400 },
    { id: 'i9', name: 'エンジンO/H 標準', category: 'フォルツァ（エンジン外注）', quantity: 0, unit: '式', unitPrice: 28000, retailPrice: 45000 },
    { id: 'i10', name: 'レーシングスーツ Sサイズ', category: 'アパレル', quantity: 3, unit: '着', unitPrice: 18000, retailPrice: 32000 },
    { id: 'i11', name: 'グローブ Mサイズ', category: 'アパレル', quantity: 8, unit: '組', unitPrice: 3500, retailPrice: 6000 },
    { id: 'i12', name: 'スリックタイヤ フロント', category: 'タイヤ', quantity: 6, unit: '本', unitPrice: 6500, retailPrice: 11000 },
    { id: 'i13', name: 'スリックタイヤ リア', category: 'タイヤ', quantity: 6, unit: '本', unitPrice: 7000, retailPrice: 12000 },
    { id: 'i14', name: 'ウェットタイヤ', category: 'タイヤ', quantity: 4, unit: '本', unitPrice: 8500, retailPrice: 14000 },
    { id: 'i15', name: 'セットアップ作業料', category: 'サービス', quantity: 0, unit: '回', unitPrice: 3000, retailPrice: 6000 }
  ];
  localStorage.setItem('invoice_sys_inventory', JSON.stringify(inventory));

  // 日付ヘルパー: N日前
  function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10);
  }

  // 入庫ログ（過去2ヶ月分）
  const purchases = [
    { id: 'p1', itemName: 'スパークプラグ NGK-01', quantity: 10, unitPrice: 800, amount: 8000, date: daysAgo(45), createdAt: Date.now() - 45 * 86400000 },
    { id: 'p2', itemName: 'エアフィルター AF-100', quantity: 5, unitPrice: 1200, amount: 6000, date: daysAgo(40), createdAt: Date.now() - 40 * 86400000 },
    { id: 'p3', itemName: 'エンジンオイル 5W-30', quantity: 20, unitPrice: 1500, amount: 30000, date: daysAgo(20), createdAt: Date.now() - 20 * 86400000 },
    { id: 'p4', itemName: 'スリックタイヤ フロント', quantity: 4, unitPrice: 6500, amount: 26000, date: daysAgo(12), createdAt: Date.now() - 12 * 86400000 },
    { id: 'p5', itemName: 'スリックタイヤ リア', quantity: 4, unitPrice: 7000, amount: 28000, date: daysAgo(12), createdAt: Date.now() - 12 * 86400000 },
    { id: 'p6', itemName: 'グローブ Mサイズ', quantity: 5, unitPrice: 3500, amount: 17500, date: daysAgo(5), createdAt: Date.now() - 5 * 86400000 }
  ];
  localStorage.setItem('invoice_sys_purchases', JSON.stringify(purchases));

  // 請求書
  function inv(id, num, cust, subj, itemsIn, dateStr) {
    const items = itemsIn.map(it => ({
      description: it.name,
      quantity: it.qty,
      unit: it.unit || '個',
      unitPrice: it.price,
      amount: it.qty * it.price,
      costPrice: it.cost || 0,
      inventoryItemId: it.invId || null,
      sourcePurchaseId: null
    }));
    const subtotal = items.reduce((s, i) => s + i.amount, 0);
    const tax = Math.floor(subtotal * 0.1);
    const total = subtotal + tax;
    const totalCost = items.reduce((s, i) => s + (i.costPrice || 0) * i.quantity, 0);
    return {
      id, invoiceNumber: num, customerName: cust, honorific: '様',
      subject: subj, invoiceDate: dateStr, dueDate: '',
      items, subtotal, taxRate: 0.1, tax, total, totalCost,
      notes: '', createdAt: new Date(dateStr).getTime(),
      sent: Math.random() > 0.5, paid: Math.random() > 0.5
    };
  }

  const invoices = [
    inv('inv1', generateInvNumStr(daysAgo(35), 1), '田中 一郎', 'レース準備一式',
        [
          { name: 'スパークプラグ NGK-01', qty: 2, unit: '個', price: 1400, cost: 800, invId: 'i1' },
          { name: 'エンジンオイル 5W-30', qty: 3, unit: '本', price: 2500, cost: 1500, invId: 'i6' }
        ], daysAgo(35)),
    inv('inv2', generateInvNumStr(daysAgo(25), 1), '佐藤 花子', '春季メンテナンス',
        [
          { name: 'エアフィルター AF-100', qty: 1, unit: '個', price: 2000, cost: 1200, invId: 'i2' },
          { name: 'ブレーキクリーナー', qty: 2, unit: '本', price: 1000, cost: 600, invId: 'i7' },
          { name: 'セットアップ作業料', qty: 1, unit: '回', price: 6000, cost: 3000, invId: 'i15' }
        ], daysAgo(25)),
    inv('inv3', generateInvNumStr(daysAgo(15), 1), '鈴木 健太', 'タイヤ交換一式',
        [
          { name: 'スリックタイヤ フロント', qty: 2, unit: '本', price: 11000, cost: 6500, invId: 'i12' },
          { name: 'スリックタイヤ リア', qty: 2, unit: '本', price: 12000, cost: 7000, invId: 'i13' }
        ], daysAgo(15)),
    inv('inv4', generateInvNumStr(daysAgo(8), 1), '高橋 美咲', 'アパレル注文',
        [
          { name: 'レーシングスーツ Sサイズ', qty: 1, unit: '着', price: 32000, cost: 18000, invId: 'i10' },
          { name: 'グローブ Mサイズ', qty: 1, unit: '組', price: 6000, cost: 3500, invId: 'i11' }
        ], daysAgo(8)),
    inv('inv5', generateInvNumStr(daysAgo(3), 1), '山本 大輔', '定期点検',
        [
          { name: 'エンジンオイル 5W-30', qty: 2, unit: '本', price: 2500, cost: 1500, invId: 'i6' },
          { name: 'チェーンルブ', qty: 1, unit: '本', price: 1400, cost: 800, invId: 'i8' },
          { name: 'セットアップ作業料', qty: 1, unit: '回', price: 6000, cost: 3000, invId: 'i15' }
        ], daysAgo(3))
  ];
  localStorage.setItem('invoice_sys_invoices', JSON.stringify(invoices));

  // 経費請求（1件）
  const expenses = [
    {
      id: 'exp1',
      expenseNumber: 'E' + daysAgo(10).replace(/-/g, '') + '-001',
      customerName: '田中 一郎',
      honorific: '様',
      subject: 'サーキット遠征交通費立替',
      expenseDate: daysAgo(10),
      dueDate: '',
      items: [
        { date: daysAgo(20), description: '東京→鈴鹿 新幹線', amount: 12800, receiptImage: null, receiptFilename: null },
        { date: daysAgo(20), description: '鈴鹿駅→サーキット タクシー', amount: 4200, receiptImage: null, receiptFilename: null },
        { date: daysAgo(19), description: '宿泊費（1泊）', amount: 8500, receiptImage: null, receiptFilename: null }
      ],
      total: 25500,
      notes: '領収書は別途郵送します',
      createdAt: Date.now() - 10 * 86400000,
      sent: true, paid: false
    }
  ];
  localStorage.setItem('invoice_sys_expenses', JSON.stringify(expenses));

  localStorage.setItem('invoice_sys_savedAt', new Date().toISOString());
}

// 請求書番号を日付から生成
function generateInvNumStr(dateStr, seq) {
  const d = dateStr.replace(/-/g, '');
  return d + '-' + String(seq).padStart(3, '0');
}
