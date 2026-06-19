import React, { useState, useEffect } from 'react';

// ════════════════════════════════════════════════════
// CONSTANTS & MOCK DATABASE
// ════════════════════════════════════════════════════

const LOCATIONS = [
  '193 Giảng Võ',
  '193 NBK',
  '74 Bà Triệu',
  '42 Huỳnh Thúc Kháng'
];

const STAFFS = [
  'Lê Hồng Quân',
  'Nguyễn Việt Thịnh',
  'Trần Văn Nam',
  'Đỗ Minh Trí'
];

const BRAND_SLOGANS = {
  'FUJI': 'Fuji là nhất, Fuji là chất',
  'CANON': 'Canon - Bản sắc chân thực',
  'SONY': 'Sony - Đỉnh cao công nghệ',
  'DJI': 'DJI - Bay cao sáng tạo',
  'NIKON': 'Nikon - Chất lượng vững bền',
  'RICOH': 'Ricoh - Đậm chất đường phố',
  'SIGMA': 'Sigma - Sắc nét vượt trội',
  'TAMRON': 'Tamron - Đồng hành muôn nơi',
  'VILTROX': 'Viltrox - Giá trị đột phá',
  'LEICA': 'Leica - Đẳng cấp nghệ thuật',
  'HASSELBLAD': 'Hasselblad - Trung thực tuyệt đối',
  'PHỤ KIỆN': 'Phụ kiện máy ảnh chất lượng'
};

const INITIAL_PRODUCTS = [
  {
    id: '37490',
    brand: 'FUJI',
    name: 'X-M5',
    specs: 'Black, Body, No box / 37490',
    price: 21990000,
    status: 'con-hang',
    color: '#000000',
    box: false,
    lens: false,
    serial: '37428',
    shotCount: '5.000',
    accessories: 'Sạc, Dây đeo, Pin',
    location: '193 NBK',
    staff: 'Nguyễn Việt Thịnh',
    condition: 97,
    description: 'Ngoại hình nhiều vết trầy, báng cầm hơi ố vàng, đế máy cấn nhẹ.',
    dateAdded: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '37491',
    brand: 'FUJI',
    name: 'X-T5',
    specs: 'Silver, Body, Fullbox / 37491',
    price: 38500000,
    status: 'con-hang',
    color: '#c0c0c0',
    box: true,
    lens: false,
    serial: '38192',
    shotCount: '2.500',
    accessories: 'Fullbox phụ kiện zin hãng',
    location: '193 Giảng Võ',
    staff: 'Lê Hồng Quân',
    condition: 99,
    description: 'Như mới không tì vết, hàng chính hãng còn bảo hành dài.',
    dateAdded: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '37492',
    brand: 'FUJI',
    name: 'X-T30 II',
    specs: 'Black, Kit 15-45mm, Fullbox / 37492',
    price: 23200000,
    status: 'con-hang',
    color: '#000000',
    box: true,
    lens: true,
    serial: '32019',
    shotCount: '12.000',
    accessories: 'Sạc, Pin, Dây đeo, Thẻ nhớ 64GB',
    location: '193 NBK',
    staff: 'Nguyễn Việt Thịnh',
    condition: 95,
    description: 'Xước dăm nhẹ góc máy, hoạt động hoàn hảo, kính lens sạch không mốc.',
    dateAdded: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '37493',
    brand: 'FUJI',
    name: 'X-S20',
    specs: 'Black, Body, Fullbox / 37493',
    price: 29900000,
    status: 'con-hang',
    color: '#000000',
    box: true,
    lens: false,
    serial: '42018',
    shotCount: '800',
    accessories: 'Fullbox, sạc zin, 2 pin, thẻ 128GB',
    location: '74 Bà Triệu',
    staff: 'Trần Văn Nam',
    condition: 99,
    description: 'Hàng lướt cực đẹp, số shot cực ít, hoàn toàn như mới.',
    dateAdded: new Date().toISOString()
  },
  {
    id: '37494',
    brand: 'FUJI',
    name: 'X100VI',
    specs: 'Silver, Fullbox, 100% / 37494',
    price: 49500000,
    status: 'con-hang',
    color: '#c0c0c0',
    box: true,
    lens: true,
    serial: '55012',
    shotCount: '50',
    accessories: 'Fullbox, tặng bao da zin',
    location: '193 Giảng Võ',
    staff: 'Lê Hồng Quân',
    condition: 100,
    description: 'Hàng sưu tầm vừa đập hộp, mới test chụp vài shot.',
    dateAdded: new Date().toISOString()
  },
  {
    id: '37495',
    brand: 'FUJI',
    name: 'X-Pro3',
    specs: 'Dura Black, Body, No box / 37495',
    price: 32500000,
    status: 'con-hang',
    color: '#3a3a3a',
    box: false,
    lens: false,
    serial: '19827',
    shotCount: '15.000',
    accessories: 'Sạc, 1 Pin zin',
    location: '42 Huỳnh Thúc Kháng',
    staff: 'Đỗ Minh Trí',
    condition: 93,
    description: 'Màu Dura Black sang trọng, xước mạ nhẹ báng cầm, màn hình phụ hoạt động tốt.',
    dateAdded: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '38490',
    brand: 'SONY',
    name: 'A7 IV',
    specs: 'Black, Body, Fullbox / 38490',
    price: 43200000,
    status: 'con-hang',
    color: '#000000',
    box: true,
    lens: false,
    serial: '66182',
    shotCount: '6.000',
    accessories: 'Fullbox đầy đủ',
    location: '193 Giảng Võ',
    staff: 'Lê Hồng Quân',
    condition: 98,
    description: 'Máy đẹp keng không tì vết, hoạt động hoàn hảo.',
    dateAdded: new Date().toISOString()
  },
  {
    id: '39490',
    brand: 'CANON',
    name: 'EOS R6 II',
    specs: 'Black, Body, Fullbox / 39490',
    price: 52000000,
    status: 'con-hang',
    color: '#000000',
    box: true,
    lens: false,
    serial: '77281',
    shotCount: '4.500',
    accessories: 'Fullbox phụ kiện zin',
    location: '74 Bà Triệu',
    staff: 'Trần Văn Nam',
    condition: 98,
    description: 'Chụp cưới, sự kiện siêu chất, máy sạch đẹp như mới.',
    dateAdded: new Date().toISOString()
  },
  {
    id: '40490',
    brand: 'DJI',
    name: 'Osmo Pocket 3 Creator Combo',
    specs: 'Black, Full Combo, Fullbox / 40490',
    price: 13990000,
    status: 'con-hang',
    color: '#000000',
    box: true,
    lens: true,
    serial: '88102',
    shotCount: '0',
    accessories: 'Đầy đủ phụ kiện trong Creator Combo',
    location: '193 Giảng Võ',
    staff: 'Lê Hồng Quân',
    condition: 99,
    description: 'Fullbox như mới, gimbal 3 trục hoạt động hoàn hảo, âm thanh thu cực ấm.',
    dateAdded: new Date().toISOString()
  },
  {
    id: '41490',
    brand: 'NIKON',
    name: 'Zfc',
    specs: 'Silver-Black, Kit 16-50mm, Fullbox / 41490',
    price: 16500000,
    status: 'con-hang',
    color: '#c0c0c0',
    box: true,
    lens: true,
    serial: '99281',
    shotCount: '1.800',
    accessories: 'Fullbox phụ kiện zin, thẻ 64GB',
    location: '193 NBK',
    staff: 'Nguyễn Việt Thịnh',
    condition: 98,
    description: 'Ngoại hình hoài cổ cực đẹp, không trầy xước, thấu kính trong vắt.',
    dateAdded: new Date().toISOString()
  },
  {
    id: '42490',
    brand: 'RICOH',
    name: 'GR III',
    specs: 'Black, Body, No box / 42490',
    price: 24500000,
    status: 'con-hang',
    color: '#000000',
    box: false,
    lens: true,
    serial: '10291',
    shotCount: '8.500',
    accessories: 'Sạc, 2 Pin, dây đeo tay da',
    location: '193 Giảng Võ',
    staff: 'Lê Hồng Quân',
    condition: 96,
    description: 'Bản quốc tế chụp snapshot đường phố đỉnh cao, xước dăm nhẹ đế máy.',
    dateAdded: new Date().toISOString()
  },
  {
    id: '43490',
    brand: 'SIGMA',
    name: '24-70mm f/2.8 DG DN Art (Sony E)',
    specs: 'Black, Lens, Fullbox / 43490',
    price: 18500000,
    status: 'con-hang',
    color: '#000000',
    box: true,
    lens: true,
    serial: '88271',
    shotCount: '0',
    accessories: 'Fullbox, cáp trước sau, hood zin, kính lọc UV',
    location: '74 Bà Triệu',
    staff: 'Trần Văn Nam',
    condition: 97,
    description: 'Lens Art sắc nét, kính đẹp không mốc rễ hay trầy xước, vòng cao su chắc chắn.',
    dateAdded: new Date().toISOString()
  },
  {
    id: '44490',
    brand: 'TAMRON',
    name: '28-75mm f/2.8 Di III VXD G2 (Sony E)',
    specs: 'Black, Lens, Fullbox / 44490',
    price: 16900000,
    status: 'con-hang',
    color: '#000000',
    box: true,
    lens: true,
    serial: '77291',
    shotCount: '0',
    accessories: 'Fullbox phụ kiện đi kèm',
    location: '193 Giảng Võ',
    staff: 'Lê Hồng Quân',
    condition: 99,
    description: 'Thế hệ 2 lấy nét cực nhanh và êm, kính trong vắt như mới.',
    dateAdded: new Date().toISOString()
  },
  {
    id: '45490',
    brand: 'VILTROX',
    name: '85mm f/1.8 II STM (Nikon Z)',
    specs: 'Black, Lens, Fullbox / 45490',
    price: 7500000,
    status: 'con-hang',
    color: '#000000',
    box: true,
    lens: true,
    serial: '55291',
    shotCount: '0',
    accessories: 'Fullbox, hood, túi vải đựng lens',
    location: '42 Huỳnh Thúc Kháng',
    staff: 'Đỗ Minh Trí',
    condition: 98,
    description: 'Lens chân dung khẩu lớn giá rẻ, xóa phông mịn màng, hoạt động hoàn hảo.',
    dateAdded: new Date().toISOString()
  },
  {
    id: '46490',
    brand: 'LEICA',
    name: 'Leica Q2',
    specs: 'Black, Compact, Fullbox / 46490',
    price: 95000000,
    status: 'con-hang',
    color: '#000000',
    box: true,
    lens: true,
    serial: '18271',
    shotCount: '3.000',
    accessories: 'Fullbox đầy đủ phụ kiện Leica',
    location: '193 Giảng Võ',
    staff: 'Lê Hồng Quân',
    condition: 99,
    description: 'Cảm biến Full Frame 47.3MP, ống kính Summilux 28mm f/1.7, thiết kế hoàn hảo.',
    dateAdded: new Date().toISOString()
  },
  {
    id: '47490',
    brand: 'HASSELBLAD',
    name: 'X2D 100C',
    specs: 'Dura Grey, Medium Format, Fullbox / 47490',
    price: 180000000,
    status: 'con-hang',
    color: '#3a3a3a',
    box: true,
    lens: false,
    serial: '22819',
    shotCount: '800',
    accessories: 'Fullbox, sạc đôi, 2 pin zin, dây đeo da',
    location: '193 NBK',
    staff: 'Nguyễn Việt Thịnh',
    condition: 99,
    description: 'Medium Format 100MP, SSD 1TB tích hợp, lấy nét theo pha PDAF vượt trội.',
    dateAdded: new Date().toISOString()
  },
  {
    id: '48490',
    brand: 'PHỤ KIỆN',
    name: 'Chân máy Peak Design Carbon Travel Tripod',
    specs: 'Black, Carbon, Fullbox / 48490',
    price: 12500000,
    status: 'con-hang',
    color: '#000000',
    box: true,
    lens: false,
    serial: 'PD-8291',
    shotCount: '0',
    accessories: 'Túi đựng tripod, lục giác tháo mở, ngàm đa năng',
    location: '193 NBK',
    staff: 'Nguyễn Việt Thịnh',
    condition: 98,
    description: 'Tripod Carbon siêu bền nhẹ, chịu lực tốt, xếp siêu gọn cho nhiếp ảnh gia.',
    dateAdded: new Date().toISOString()
  }
];

const INITIAL_HISTORY = [
  {
    id: 'hist_1',
    type: 'nhap',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Nguyễn Việt Thịnh',
    location: '193 NBK',
    productName: 'Fuji X-M5',
    serial: '37428',
    details: 'Nhập kho máy cũ Fuji X-M5 ngoại hình 97%.'
  },
  {
    id: 'hist_2',
    type: 'nhap',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Lê Hồng Quân',
    location: '193 Giảng Võ',
    productName: 'DJI Osmo Pocket 3 Creator Combo',
    serial: '88102',
    details: 'Nhập kho máy DJI Osmo Pocket 3 Creator Combo ngoại hình 99%.'
  }
];

export default function App() {
  // ════════════════════════════════════════════════════
  // 1. STATE CONFIGURATION
  // ════════════════════════════════════════════════════
  const [products, setProducts] = useState(() => {
    const stored = localStorage.getItem('nippon_camera_products');
    return stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
  });

  const [history, setHistory] = useState(() => {
    const stored = localStorage.getItem('nippon_camera_history');
    return stored ? JSON.parse(stored) : INITIAL_HISTORY;
  });

  const [currentTab, setCurrentTab] = useState('check-gia');
  const [currentBrand, setCurrentBrand] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeThumbIndex, setActiveThumbIndex] = useState(0);
  
  // Modals state
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [mDepStaff, setMDepStaff] = useState(STAFFS[0]);
  const [mDepLocation, setMDepLocation] = useState(LOCATIONS[0]);

  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [mSellStaff, setMSellStaff] = useState(STAFFS[0]);
  const [mSellLocation, setMSellLocation] = useState(LOCATIONS[0]);

  // Entry form state (NHẬP LIỆU)
  const [fBrand, setFBrand] = useState('FUJI');
  const [fName, setFName] = useState('');
  const [fColor, setFColor] = useState('#000000');
  const [fPrice, setFPrice] = useState('');
  const [fSerial, setFSerial] = useState('');
  const [fShot, setFShot] = useState('');
  const [fLocation, setFLocation] = useState(LOCATIONS[0]);
  const [fStaff, setFStaff] = useState(STAFFS[0]);
  const [fCondition, setFCondition] = useState(97);
  const [fBox, setFBox] = useState(false);
  const [fLens, setFLens] = useState(false);
  const [fAccessories, setFAccessories] = useState('');
  const [fDesc, setFDesc] = useState('');

  // Toast state
  const [toast, setToast] = useState(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('nippon_camera_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('nippon_camera_history', JSON.stringify(history));
  }, [history]);

  // Check weekly expired deposits on mount
  useEffect(() => {
    const checkExpiredDeposits = () => {
      let changed = false;
      const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const updatedProducts = products.map(p => {
        if (p.status === 'da-coc' && p.depositInfo && p.depositInfo.date) {
          const depositTime = new Date(p.depositInfo.date).getTime();
          if (depositTime < oneWeekAgo) {
            changed = true;
            const newLog = {
              id: 'hist_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
              type: 'he-thong',
              date: new Date().toISOString(),
              staff: 'Hệ thống',
              location: p.depositInfo.location,
              productName: `${p.brand} ${p.name}`,
              serial: p.serial,
              details: `Hệ thống tự động hủy cọc quá hạn 1 tuần (đặt bởi ${p.depositInfo.staff} tại ${p.depositInfo.location})`
            };
            setHistory(prev => [newLog, ...prev]);
            
            const updatedP = { ...p, status: 'con-hang' };
            delete updatedP.depositInfo;
            return updatedP;
          }
        }
        return p;
      });

      if (changed) {
        setProducts(updatedProducts);
      }
    };
    checkExpiredDeposits();
  }, []);

  // Helpers
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const formatMoneyRaw = (num) => {
    return num.toLocaleString('vi-VN');
  };

  const formatMoney = (num) => {
    return num.toLocaleString('vi-VN') + ' đ';
  };

  const formatDate = (isoStr) => {
    const d = new Date(isoStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  // Add a history item helper
  const addLog = (type, staff, location, productName, serial, details) => {
    const newLog = {
      id: 'hist_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      type,
      date: new Date().toISOString(),
      staff,
      location,
      productName,
      serial,
      details
    };
    setHistory(prev => [newLog, ...prev]);
  };

  // ════════════════════════════════════════════════════
  // 2. TRANSACTION LOGIC
  // ════════════════════════════════════════════════════

  // Confirm Deposit
  const handleConfirmDeposit = (e) => {
    e.preventDefault();
    if (!currentProduct) return;

    const updatedProducts = products.map(p => {
      if (p.id === currentProduct.id) {
        const updated = {
          ...p,
          status: 'da-coc',
          depositInfo: {
            staff: mDepStaff,
            location: mDepLocation,
            date: new Date().toISOString()
          }
        };
        setCurrentProduct(updated);
        return updated;
      }
      return p;
    });

    setProducts(updatedProducts);
    addLog(
      'coc',
      mDepStaff,
      mDepLocation,
      `${currentProduct.brand} ${currentProduct.name}`,
      currentProduct.serial,
      `Xác nhận khách nhận cọc máy ${currentProduct.brand} ${currentProduct.name} (Serial: ${currentProduct.serial}) cho khách của ${mDepStaff} tại chi nhánh ${mDepLocation}.`
    );

    showToast(`Đã nhận cọc máy ${currentProduct.name} thành công!`);
    setDepositModalOpen(false);
  };

  // Confirm Sale
  const handleConfirmSell = (e) => {
    e.preventDefault();
    if (!currentProduct) return;

    const updatedProducts = products.map(p => {
      if (p.id === currentProduct.id) {
        const updated = {
          ...p,
          status: 'da-ban',
          sellInfo: {
            staff: mSellStaff,
            location: mSellLocation,
            date: new Date().toISOString()
          }
        };
        setCurrentProduct(updated);
        return updated;
      }
      return p;
    });

    setProducts(updatedProducts);
    addLog(
      'ban',
      mSellStaff,
      mSellLocation,
      `${currentProduct.brand} ${currentProduct.name}`,
      currentProduct.serial,
      `Xác nhận đã bán máy ${currentProduct.brand} ${currentProduct.name} (Serial: ${currentProduct.serial}) cho khách, thực hiện bởi ${mSellStaff} tại chi nhánh ${mSellLocation}.`
    );

    showToast(`Đã bán máy ${currentProduct.name} thành công!`);
    setSellModalOpen(false);
  };

  // Release / Reset Product to In Stock
  const handleReleaseProduct = () => {
    if (!currentProduct) return;

    const updatedProducts = products.map(p => {
      if (p.id === currentProduct.id) {
        const updated = { ...p, status: 'con-hang' };
        delete updated.depositInfo;
        delete updated.sellInfo;
        setCurrentProduct(updated);
        return updated;
      }
      return p;
    });

    setProducts(updatedProducts);
    addLog(
      'he-thong',
      'Hệ thống',
      currentProduct.location,
      `${currentProduct.brand} ${currentProduct.name}`,
      currentProduct.serial,
      `Reset trạng thái từ ${currentProduct.status === 'da-coc' ? 'Đã cọc' : 'Đã bán'} về Còn hàng`
    );

    showToast(`Đã giải phóng máy ${currentProduct.name} về trạng thái Còn hàng!`);
  };

  // Add new used arrival (NHẬP LIỆU)
  const handleAddProduct = (e) => {
    e.preventDefault();
    const newId = 'sku_' + Date.now();
    const newProduct = {
      id: newId,
      brand: fBrand,
      name: fName,
      specs: `${fColor === '#000000' ? 'Black' : 'Color'}, ${fLens ? 'Kit' : 'Body'}, ${fBox ? 'Fullbox' : 'No box'} / ${newId}`,
      price: parseInt(fPrice, 10),
      status: 'con-hang',
      color: fColor,
      box: fBox,
      lens: fLens,
      serial: fSerial,
      shotCount: fShot,
      accessories: fAccessories,
      location: fLocation,
      staff: fStaff.split(' ').pop(),
      condition: parseInt(fCondition, 10),
      description: fDesc,
      dateAdded: new Date().toISOString()
    };

    setProducts(prev => [...prev, newProduct]);
    addLog(
      'nhap',
      fStaff,
      fLocation,
      `${fBrand} ${fName}`,
      fSerial,
      `Nhập kho thành công máy cũ ${fBrand} ${fName} ngoại hình ${fCondition}% bởi ${fStaff}.`
    );

    showToast(`Đã nhập kho thành công máy ${fBrand} ${fName}!`);

    // Reset fields
    setFName('');
    setFPrice('');
    setFSerial('');
    setFShot('');
    setFAccessories('');
    setFDesc('');
    setFBox(false);
    setFLens(false);

    // Redirect to brand list
    setCurrentBrand(fBrand);
    setCurrentProduct(null);
    setCurrentTab('check-gia');
  };

  // Backup & Import
  const handleExportDB = () => {
    const db = { products, history };
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nippon_camera_db_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Đã kết xuất dữ liệu bảng giá thành công!');
  };

  const handleImportDB = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const db = JSON.parse(event.target.result);
        if (db && Array.isArray(db.products) && Array.isArray(db.history)) {
          setProducts(db.products);
          setHistory(db.history);
          showToast('Đã nhập cơ sở dữ liệu thành công!', 'success');
        } else {
          showToast('Định dạng file sao lưu không hợp lệ!', 'error');
        }
      } catch (err) {
        showToast('Lỗi khi đọc file sao lưu!', 'error');
      }
    };
    reader.readAsText(file);
  };

  // ════════════════════════════════════════════════════
  // 3. SELECTION & FILTER LOGIC
  // ════════════════════════════════════════════════════

  // Get active lists
  let filteredProducts = products;
  if (currentBrand) {
    filteredProducts = filteredProducts.filter(p => p.brand === currentBrand);
  }

  // Search filter
  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(q) || p.specs.toLowerCase().includes(q)
    );
  }

  // Price range filter
  if (priceFilter === 'duoi-15') {
    filteredProducts = filteredProducts.filter(p => p.price < 15000000);
  } else if (priceFilter === '15-30') {
    filteredProducts = filteredProducts.filter(p => p.price >= 15000000 && p.price <= 30000000);
  } else if (priceFilter === 'tren-30') {
    filteredProducts = filteredProducts.filter(p => p.price > 30000000);
  }

  // Pagination slice
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const pagedProducts = filteredProducts.slice(startIdx, startIdx + itemsPerPage);

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    if (tab !== 'check-gia') {
      setCurrentBrand(null);
      setCurrentProduct(null);
      setSearchQuery('');
      setPriceFilter('');
    }
  };

  const handleBrandSelect = (brand) => {
    setCurrentBrand(brand);
    setCurrentPage(1);
    setPriceFilter('');
    setCurrentProduct(null);
  };

  // ════════════════════════════════════════════════════
  // 4. RENDERING JSX SUB-VIEWS
  // ════════════════════════════════════════════════════

  return (
    <div className="appContainer">
      <h1 className="appTitle">Bảng giá hàng cũ Nippon Camera</h1>

      {/* Toast popup */}
      {toast && (
        <div className={`toast-notif show toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* Bottom Nav Bar */}
      <div className="bottomNavBar" role="navigation" aria-label="Bottom Navigation">
        <button
          className={`bottomNavBtn ${currentTab === 'check-gia' ? 'active' : ''}`}
          data-tab="check-gia"
          onClick={() => handleTabChange('check-gia')}
        >
          CHECK GIÁ
        </button>
        <button
          className={`bottomNavBtn ${currentTab === 'nhap-lieu' ? 'active' : ''}`}
          data-tab="nhap-lieu"
          onClick={() => handleTabChange('nhap-lieu')}
        >
          NHẬP LIỆU
        </button>
        <button
          className={`bottomNavBtn ${currentTab === 'lich-su' ? 'active' : ''}`}
          data-tab="lich-su"
          onClick={() => handleTabChange('lich-su')}
        >
          LỊCH SỬ
        </button>
      </div>

      {/* ── SUBVIEW: CHECK GIÁ ── */}
      {currentTab === 'check-gia' && (
        <div id="check-gia-view">
          {/* Search panel: hide on details view */}
          {!currentProduct && (
            <div className="searchPanel" id="search-panel">
              <span className="searchLabel">Tìm kiếm nhanh</span>
              <div className="searchBox">
                <input
                  type="text"
                  className="searchInput"
                  id="search-input-field"
                  placeholder="Nhập tên máy cần tìm kiếm"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  autoComplete="off"
                />
                {searchQuery.trim() !== '' && (
                  <button
                    type="button"
                    className="clearSearchBtn"
                    onClick={() => {
                      setSearchQuery('');
                      setCurrentPage(1);
                    }}
                  >
                    ✕
                  </button>
                )}
                <span className="searchIconBtn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </span>
              </div>
            </div>
          )}

          {/* 1. BRAND GRID VIEW */}
          {!currentBrand && !currentProduct && (
            <div className="brandGrid" id="brand-grid">
              {Object.keys(BRAND_SLOGANS).map(b => (
                <button
                  key={b}
                  className={`brandCard ${b === 'FUJI' ? 'highlight-brand' : ''}`}
                  onClick={() => handleBrandSelect(b)}
                >
                  {b}
                </button>
              ))}
            </div>
          )}

          {/* 2. SUB-BRAND PRODUCT LIST VIEW */}
          {currentBrand && !currentProduct && (
            <div id="brand-list">
              <div className="brandListHeader">
                <div className="brandBranding">
                  <div className="brandLogoWrapper">
                    {currentBrand === 'FUJI' ? <span className="red-circle-logo"></span> : null}
                    {currentBrand}
                  </div>
                  <p className="brandSlogan">{BRAND_SLOGANS[currentBrand]}</p>
                </div>
                <div className="filterWrapper">
                  <label htmlFor="price-filter-select">Bộ lọc giá</label>
                  <div className="custom-select">
                    <select
                      id="price-filter-select"
                      value={priceFilter}
                      onChange={(e) => {
                        setPriceFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="">Tất cả mức giá</option>
                      <option value="duoi-15">Dưới 15 triệu</option>
                      <option value="15-30">15 - 30 triệu</option>
                      <option value="tren-30">Trên 30 triệu</option>
                    </select>
                  </div>
                </div>
              </div>

              {pagedProducts.length === 0 ? (
                <div className="noProducts">
                  <p>Không tìm thấy sản phẩm cũ nào phù hợp.</p>
                </div>
              ) : (
                <div className="productGrid">
                  {pagedProducts.map(p => {
                    let statusText = 'Còn hàng';
                    let statusClass = 'status-con';
                    if (p.status === 'da-coc') {
                      statusText = 'Đã cọc';
                      statusClass = 'status-coc';
                    } else if (p.status === 'da-ban') {
                      statusText = 'Đã bán';
                      statusClass = 'status-ban';
                    }

                    return (
                      <div
                        key={p.id}
                        className="productCard"
                        onClick={() => {
                          setCurrentProduct(p);
                          setActiveThumbIndex(0);
                        }}
                      >
                        <div className="productCardImage">
                          <svg className="placeholder-img-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                        </div>
                        <div className="productCardInfo">
                          <div className={`productCardStatus ${statusClass}`}>{statusText}</div>
                          <h3 className="productCardTitle">{p.name}</h3>
                          <p className="productCardSpecs">{p.specs.split(' / ')[0]}</p>
                          <p className="productCardId">SKU: {p.id}</p>
                          <div className="productCardPrice">{formatMoneyRaw(p.price)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Circular Pagination Buttons */}
              {totalPages > 1 && (
                <div className="pagination">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                    <button
                      key={num}
                      className={`pagBtn ${num === currentPage ? 'active' : ''}`}
                      onClick={() => setCurrentPage(num)}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. PRODUCT DETAILS VIEW */}
          {currentProduct && (
            <div id="product-detail">
              {/* Breadcrumbs */}
              <div className="breadcrumbs">
                <button
                  className="bcHomeBtn"
                  onClick={() => {
                    setCurrentProduct(null);
                    setCurrentBrand(null);
                  }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                  </svg>
                </button>
                <span className="bcSeparator">/</span>
                <button className="bcBrandBtn" onClick={() => setCurrentProduct(null)}>
                  {currentProduct.brand}
                </button>
                <span className="bcSeparator">/</span>
                <span className="bcProduct">{currentProduct.name}</span>
              </div>

              {/* Grid content */}
              <div className="detailContent">
                {/* Left Specs */}
                <div className="detailSpecs">
                  <h2 className="detailTitle">{currentProduct.name}</h2>
                  <div className="specsGrid">
                    <div className="specsLabel">Màu:</div>
                    <div className="specsValue">
                      <span className="colorDot" style={{ backgroundColor: currentProduct.color }}></span>
                    </div>

                    <div className="specsLabel">Box:</div>
                    <div className="specsValue">
                      {currentProduct.box ? (
                        <span className="statusBadge badgeCheck">
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </span>
                      ) : (
                        <span className="statusBadge badgeCross">✕</span>
                      )}
                    </div>

                    <div className="specsLabel">Lens:</div>
                    <div className="specsValue">
                      {currentProduct.lens ? (
                        <span className="statusBadge badgeCheck">
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </span>
                      ) : (
                        <span className="statusBadge badgeCross">✕</span>
                      )}
                    </div>

                    <div className="specsLabel">Serial:</div>
                    <div className="specsValue">{currentProduct.serial}</div>

                    <div className="specsLabel">Số shot:</div>
                    <div className="specsValue">{currentProduct.shotCount}</div>

                    <div className="specsLabel">Phụ kiện:</div>
                    <div className="specsValue">{currentProduct.accessories}</div>

                    <div className="specsLabel">Vị trí:</div>
                    <div className="specsValue">{currentProduct.location}</div>
                  </div>

                  <div className="specsStaff">
                    <div className="staffIcon">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                      </svg>
                    </div>
                    <span>{currentProduct.staff}</span>
                  </div>
                </div>

                {/* Right Gallery */}
                <div className="detailGallery">
                  <div className="thumbColumn">
                    {[0, 1, 2].map(idx => (
                      <div
                        key={idx}
                        className={`thumbItem ${idx === activeThumbIndex ? 'active' : ''}`}
                        onClick={() => setActiveThumbIndex(idx)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                    ))}
                  </div>

                  <div className="mainImageWrapper">
                    <div
                      className={`mainImageBadge ${
                        currentProduct.status === 'con-hang'
                          ? 'status-con'
                          : currentProduct.status === 'da-coc'
                          ? 'status-coc'
                          : 'status-ban'
                      }`}
                    >
                      {currentProduct.status === 'con-hang'
                        ? 'Còn hàng'
                        : currentProduct.status === 'da-coc'
                        ? 'Đã cọc'
                        : 'Đã bán'}
                    </div>
                    <div className="mainImageContainer">
                      <svg className="placeholder-img-icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action and Download Row */}
              <div className="galleryActions">
                <button
                  className="downloadBtn"
                  onClick={() => showToast(`Đã tải xuống ảnh máy ${currentProduct.name} thành công!`)}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                  TẢI XUỐNG
                </button>
                <div className="detailPrice">{formatMoneyRaw(currentProduct.price)}</div>
              </div>

              {/* Condition progress bar & actions */}
              <div className="detailBottom">
                <div className="conditionWrapper">
                  <div className="conditionLabel">
                    <span>Tình trạng:</span>
                    <strong>{currentProduct.condition}%</strong>
                  </div>
                  <div className="progressBarContainer">
                    <div className="progressBar" style={{ width: `${currentProduct.condition}%` }}></div>
                  </div>
                  <div className="descWrapper">
                    <strong>Mô tả ngắn:</strong>
                    <p>{currentProduct.description}</p>
                  </div>
                </div>

                <div className="actionsWrapper">
                  {currentProduct.status === 'con-hang' ? (
                    <>
                      <button className="actionBtn btnBan" onClick={() => setSellModalOpen(true)}>
                        BÁN NGAY
                      </button>
                      <button className="actionBtn btnCoc" onClick={() => setDepositModalOpen(true)}>
                        NHẬN CỌC
                      </button>
                    </>
                  ) : currentProduct.status === 'da-coc' ? (
                    <>
                      <button className="actionBtn btnBan" onClick={() => setSellModalOpen(true)}>
                        BÁN NGAY
                      </button>
                      <button className="actionBtn btnRelease" onClick={handleReleaseProduct}>
                        HỦY CỌC (CÒN HÀNG)
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="statusNotice">Sản phẩm này đã được bán thành công.</p>
                      <button className="actionBtn btnRelease" onClick={handleReleaseProduct}>
                        RESET CÒN HÀNG
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── SUBVIEW: NHẬP LIỆU ── */}
      {currentTab === 'nhap-lieu' && (
        <div id="nhap-lieu-view">
          <div className="viewHeader">
            <h2>NHẬP KHO MÁY CŨ MỚI</h2>
            <p className="viewSubtitle">Điền đầy đủ thông tin để nhập kho sản phẩm cũ vào bảng giá hệ thống.</p>
          </div>

          <form onSubmit={handleAddProduct} className="entryForm">
            <div className="formGrid">
              <div className="formGroup">
                <label htmlFor="f-brand">Thương hiệu *</label>
                <select id="f-brand" value={fBrand} onChange={(e) => setFBrand(e.target.value)}>
                  {Object.keys(BRAND_SLOGANS).map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="formGroup">
                <label htmlFor="f-name">Tên model *</label>
                <input
                  type="text"
                  id="f-name"
                  placeholder="Ví dụ: X-M5, EOS R6 II..."
                  value={fName}
                  onChange={(e) => setFName(e.target.value)}
                  required
                />
              </div>

              <div className="formGroup">
                <label htmlFor="f-color">Màu sắc *</label>
                <div className="colorInputWrapper">
                  <input
                    type="color"
                    id="f-color"
                    value={fColor}
                    onChange={(e) => setFColor(e.target.value)}
                  />
                  <input
                    type="text"
                    id="f-color-text"
                    value={fColor}
                    onChange={(e) => setFColor(e.target.value)}
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div className="formGroup">
                <label htmlFor="f-price">Giá bán (VNĐ) *</label>
                <input
                  type="number"
                  id="f-price"
                  placeholder="Ví dụ: 21990000"
                  value={fPrice}
                  onChange={(e) => setFPrice(e.target.value)}
                  required
                />
              </div>

              <div className="formGroup">
                <label htmlFor="f-serial">Mã Serial *</label>
                <input
                  type="text"
                  id="f-serial"
                  placeholder="Ví dụ: 37428"
                  value={fSerial}
                  onChange={(e) => setFSerial(e.target.value)}
                  required
                />
              </div>

              <div className="formGroup">
                <label htmlFor="f-shot">Số shot chụp *</label>
                <input
                  type="text"
                  id="f-shot"
                  placeholder="Ví dụ: 5.000, 15.000..."
                  value={fShot}
                  onChange={(e) => setFShot(e.target.value)}
                  required
                />
              </div>

              <div className="formGroup">
                <label htmlFor="f-location">Vị trí kho máy *</label>
                <select id="f-location" value={fLocation} onChange={(e) => setFLocation(e.target.value)}>
                  {LOCATIONS.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div className="formGroup">
                <label htmlFor="f-staff">Nhân viên phụ trách nhập *</label>
                <select id="f-staff" value={fStaff} onChange={(e) => setFStaff(e.target.value)}>
                  {STAFFS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="formGroup">
                <label htmlFor="f-condition">Tình trạng máy (%) *</label>
                <input
                  type="number"
                  id="f-condition"
                  min="1"
                  max="100"
                  value={fCondition}
                  onChange={(e) => setFCondition(parseInt(e.target.value, 10))}
                  required
                />
              </div>

              <div className="formGroup checkboxGroup">
                <label>
                  <input
                    type="checkbox"
                    id="f-box"
                    checked={fBox}
                    onChange={(e) => setFBox(e.target.checked)}
                  />{' '}
                  Máy kèm Hộp (Fullbox)
                </label>
                <label>
                  <input
                    type="checkbox"
                    id="f-lens"
                    checked={fLens}
                    onChange={(e) => setFLens(e.target.checked)}
                  />{' '}
                  Máy đi kèm Ống kính (Lens Kit)
                </label>
              </div>
            </div>

            <div className="formGroup fullWidth">
              <label htmlFor="f-accessories">Danh sách phụ kiện kèm theo *</label>
              <input
                type="text"
                id="f-accessories"
                placeholder="Ví dụ: Sạc, Pin, Dây đeo, Thẻ nhớ..."
                value={fAccessories}
                onChange={(e) => setFAccessories(e.target.value)}
                required
              />
            </div>

            <div className="formGroup fullWidth">
              <label htmlFor="f-desc">Mô tả ngắn tình trạng ngoại hình *</label>
              <textarea
                id="f-desc"
                rows="3"
                placeholder="Ví dụ: Ngoại hình trầy nhẹ góc, báng cầm hơi ố, thấu kính sạch..."
                value={fDesc}
                onChange={(e) => setFDesc(e.target.value)}
                required
              ></textarea>
            </div>

            <button type="submit" className="submitBtn">LƯU SẢN PHẨM</button>
          </form>

          {/* Backup Database */}
          <div className="backupRestoreSection">
            <h3>SAO LƯU & ĐỒNG BỘ DỮ LIỆU</h3>
            <p className="backupText">
              Vì hệ thống vận hành hoàn toàn phía máy khách (Client-side), bạn có thể xuất cơ sở dữ liệu làm file JSON để gửi cho nhân viên chi nhánh khác, hoặc nhập file JSON nhận được để cập nhật bảng giá.
            </p>
            <div className="backupActions">
              <button type="button" className="backupBtn btnExport" onClick={handleExportDB}>
                XUẤT DỮ LIỆU JSON
              </button>
              <button
                type="button"
                className="backupBtn btnImport"
                onClick={() => document.getElementById('import-db-file').click()}
              >
                NHẬP DỮ LIỆU JSON
              </button>
              <input
                type="file"
                id="import-db-file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={handleImportDB}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── SUBVIEW: LỊCH SỬ GIAO DỊCH ── */}
      {currentTab === 'lich-su' && (
        <div id="lich-su-view">
          <div className="viewHeader">
            <h2>LỊCH SỬ GIAO DỊCH NỘI BỘ</h2>
            <p className="viewSubtitle">Theo dõi toàn bộ các hoạt động nhập kho, bán hàng và nhận cọc tại các chi nhánh.</p>
          </div>

          <div className="historyTimeline">
            {history.length === 0 ? (
              <p className="noHistory">Chưa có hoạt động giao dịch nào được ghi nhận.</p>
            ) : (
              history.map(log => {
                let typeText = 'HỆ THỐNG';
                let typeClass = 'type-system';
                if (log.type === 'nhap') {
                  typeText = 'NHẬP KHO';
                  typeClass = 'type-nhap';
                } else if (log.type === 'coc') {
                  typeText = 'CỌC MÁY';
                  typeClass = 'type-coc';
                } else if (log.type === 'ban') {
                  typeText = 'ĐÃ BÁN';
                  typeClass = 'type-ban';
                }

                return (
                  <div key={log.id} className="historyItem">
                    <div className="historyMeta">
                      <span className={`historyType ${typeClass}`}>{typeText}</span>
                      <span className="historyTime">{formatDate(log.date)}</span>
                    </div>
                    <div className="historyContent">
                      <p className="historyDetails">{log.details}</p>
                      <div className="historyFooter">
                        <span><strong>Người thực hiện:</strong> {log.staff}</span>
                        <span className="dot-separator">•</span>
                        <span><strong>Chi nhánh:</strong> {log.location}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
         MODALS (DEPOSIT & SELL)
         ════════════════════════════════════════════════════ */}

      {/* DEPOSIT MODAL */}
      {depositModalOpen && currentProduct && (
        <div className="modalOverlay" id="deposit-modal">
          <div className="modalBox">
            <button className="modalCloseBtn" onClick={() => setDepositModalOpen(false)}>
              ✕
            </button>

            <div className="modalProductCard">
              <div className="modalProductImg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <div className="modalProductInfo">
                <h4>{currentProduct.name}</h4>
                <p>
                  {currentProduct.specs.split(' / ')[0]} / {currentProduct.serial}
                </p>
                <div className="modalProductPrice">{formatMoney(currentProduct.price)}</div>
              </div>
            </div>

            <form onSubmit={handleConfirmDeposit}>
              <div className="modalFormFields">
                <div className="modalFieldGroup">
                  <label htmlFor="m-dep-staff">Khách cọc của</label>
                  <select
                    id="m-dep-staff"
                    value={mDepStaff}
                    onChange={(e) => setMDepStaff(e.target.value)}
                    required
                  >
                    {STAFFS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="modalFieldGroup">
                  <select
                    id="m-dep-location"
                    value={mDepLocation}
                    onChange={(e) => setMDepLocation(e.target.value)}
                    required
                  >
                    {LOCATIONS.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" className="modalSubmitBtn btnCoc">
                XÁC NHẬN CỌC MÁY
              </button>
            </form>

            <p className="modalDisclaimer">
              * Lưu ý: Thời hạn cọc hệ thống không quá 1 tuần, sau thời gian này hệ thống sẽ tự reset về tình trạng còn hàng.
            </p>
          </div>
        </div>
      )}

      {/* SELL MODAL */}
      {sellModalOpen && currentProduct && (
        <div className="modalOverlay" id="sell-modal">
          <div className="modalBox">
            <button className="modalCloseBtn" onClick={() => setSellModalOpen(false)}>
              ✕
            </button>

            <div className="modalProductCard">
              <div className="modalProductImg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <div className="modalProductInfo">
                <h4>{currentProduct.name}</h4>
                <p>
                  {currentProduct.specs.split(' / ')[0]} / {currentProduct.serial}
                </p>
                <div className="modalProductPrice">{formatMoney(currentProduct.price)}</div>
              </div>
            </div>

            <form onSubmit={handleConfirmSell}>
              <div className="modalFormFields">
                <div className="modalFieldGroup">
                  <label htmlFor="m-sell-staff">Tên người bán</label>
                  <select
                    id="m-sell-staff"
                    value={mSellStaff}
                    onChange={(e) => setMSellStaff(e.target.value)}
                    required
                  >
                    {STAFFS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="modalFieldGroup">
                  <select
                    id="m-sell-location"
                    value={mSellLocation}
                    onChange={(e) => setMSellLocation(e.target.value)}
                    required
                  >
                    {LOCATIONS.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" className="modalSubmitBtn btnBan">
                XÁC NHẬN ĐÃ BÁN
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
