import { useState, useEffect, useMemo, useRef } from 'react';

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

// FIX #2: Magic strings → named constants
const PRODUCT_STATUS = {
  IN_STOCK: 'con-hang',
  DEPOSITED: 'da-coc',
  SOLD: 'da-ban',
};

const LOG_TYPE = {
  IMPORT: 'nhap',
  DEPOSIT: 'coc',
  SELL: 'ban',
  SYSTEM: 'he-thong',
};

const INITIAL_PRODUCTS = [
  {
    id: '37490',
    brand: 'FUJI',
    name: 'X-M5',
    specs: 'Black, Body, No box / 37490',
    price: 21990000,
    status: PRODUCT_STATUS.IN_STOCK,
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
    status: PRODUCT_STATUS.IN_STOCK,
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
    status: PRODUCT_STATUS.IN_STOCK,
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
    status: PRODUCT_STATUS.IN_STOCK,
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
    status: PRODUCT_STATUS.IN_STOCK,
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
    status: PRODUCT_STATUS.IN_STOCK,
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
    status: PRODUCT_STATUS.IN_STOCK,
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
    status: PRODUCT_STATUS.IN_STOCK,
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
    status: PRODUCT_STATUS.IN_STOCK,
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
    status: PRODUCT_STATUS.IN_STOCK,
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
    status: PRODUCT_STATUS.IN_STOCK,
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
    status: PRODUCT_STATUS.IN_STOCK,
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
    status: PRODUCT_STATUS.IN_STOCK,
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
    status: PRODUCT_STATUS.IN_STOCK,
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
    status: PRODUCT_STATUS.IN_STOCK,
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
    status: PRODUCT_STATUS.IN_STOCK,
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
    status: PRODUCT_STATUS.IN_STOCK,
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
  },

  // ── SONY ──
  {
    id: '49490',
    brand: 'SONY',
    name: 'A7C II',
    specs: 'Silver, Body, Fullbox / 49490',
    price: 46500000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#c0c0c0',
    box: true,
    lens: false,
    serial: '70192',
    shotCount: '3.200',
    accessories: 'Fullbox đầy đủ phụ kiện Sony',
    location: '193 Giảng Võ',
    staff: 'Lê Hồng Quân',
    condition: 97,
    description: 'Màu Silver sang trọng, AI AF xịn, body nhỏ gọn, hoạt động hoàn hảo.',
    dateAdded: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '50490',
    brand: 'SONY',
    name: 'ZV-E10 II',
    specs: 'Black, Body, Fullbox / 50490',
    price: 14900000,
    status: PRODUCT_STATUS.DEPOSITED,
    color: '#000000',
    box: true,
    lens: false,
    serial: '71029',
    shotCount: '500',
    accessories: 'Fullbox, thẻ nhớ 64GB, dây đeo',
    location: '74 Bà Triệu',
    staff: 'Trần Văn Nam',
    condition: 99,
    description: 'Máy quay vlog APS-C mới nhất, như mới đập hộp, AF bắt mắt cực nhanh.',
    dateAdded: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    depositInfo: {
      staff: 'Trần Văn Nam',
      location: '74 Bà Triệu',
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: '51490',
    brand: 'SONY',
    name: 'FX30',
    specs: 'Black, Body, Fullbox / 51490',
    price: 36900000,
    status: PRODUCT_STATUS.SOLD,
    color: '#000000',
    box: true,
    lens: false,
    serial: '72910',
    shotCount: '1.200',
    accessories: 'Fullbox, tay cầm XLR-H1, 2 pin',
    location: '193 Giảng Võ',
    staff: 'Lê Hồng Quân',
    condition: 98,
    description: 'Cinema Line APS-C quay phim cực chất, ổn định màu sắc, AF theo mắt.',
    dateAdded: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    sellInfo: {
      staff: 'Lê Hồng Quân',
      location: '193 Giảng Võ',
      date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString()
    }
  },

  // ── CANON ──
  {
    id: '52490',
    brand: 'CANON',
    name: 'EOS R50',
    specs: 'White, Kit 18-45mm, Fullbox / 52490',
    price: 15500000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#f5f5f5',
    box: true,
    lens: true,
    serial: '80291',
    shotCount: '2.100',
    accessories: 'Fullbox, thẻ nhớ 32GB, túi máy',
    location: '193 NBK',
    staff: 'Nguyễn Việt Thịnh',
    condition: 98,
    description: 'Màu White nổi bật, kit lens 18-45mm sắc nét, phù hợp người mới bắt đầu.',
    dateAdded: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '53490',
    brand: 'CANON',
    name: 'EOS R5 Mark II',
    specs: 'Black, Body, Fullbox / 53490',
    price: 88000000,
    status: PRODUCT_STATUS.SOLD,
    color: '#000000',
    box: true,
    lens: false,
    serial: '81029',
    shotCount: '4.800',
    accessories: 'Fullbox đầy đủ, thêm grip BG-R10',
    location: '74 Bà Triệu',
    staff: 'Trần Văn Nam',
    condition: 99,
    description: 'Flagship hybrid quay phim 8K RAW, AF nhân tạo cực mạnh, máy sạch bóng.',
    dateAdded: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    sellInfo: {
      staff: 'Trần Văn Nam',
      location: '74 Bà Triệu',
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    }
  },

  // ── DJI ──
  {
    id: '54490',
    brand: 'DJI',
    name: 'Mini 4 Pro Fly More Combo Plus',
    specs: 'Grey, Fly More Combo Plus, Fullbox / 54490',
    price: 21500000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#3a3a3a',
    box: true,
    lens: true,
    serial: '89201',
    shotCount: '0',
    accessories: 'Đầy đủ Fly More Combo Plus: sạc hub, 3 pin, túi đeo',
    location: '42 Huỳnh Thúc Kháng',
    staff: 'Đỗ Minh Trí',
    condition: 99,
    description: 'Drone 4K HDR siêu gọn, tránh chướng ngại vật 4 chiều, bay 34 phút, fullbox như mới.',
    dateAdded: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '55490',
    brand: 'DJI',
    name: 'RS 4 Pro',
    specs: 'Black, Combo, Fullbox / 55490',
    price: 11900000,
    status: PRODUCT_STATUS.DEPOSITED,
    color: '#000000',
    box: true,
    lens: false,
    serial: '90102',
    shotCount: '0',
    accessories: 'Gimbal, focus motor, sạc đa năng, túi vải',
    location: '193 Giảng Võ',
    staff: 'Lê Hồng Quân',
    condition: 98,
    description: 'Gimbal chuyên nghiệp tải trọng 4.5kg, bộ nhớ 20GB tích hợp, ổn định tuyệt vời.',
    dateAdded: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    depositInfo: {
      staff: 'Nguyễn Việt Thịnh',
      location: '193 NBK',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  },

  // ── NIKON ──
  {
    id: '56490',
    brand: 'NIKON',
    name: 'Z30',
    specs: 'Black, Kit 16-50mm, Fullbox / 56490',
    price: 13500000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#000000',
    box: true,
    lens: true,
    serial: '10029',
    shotCount: '3.500',
    accessories: 'Fullbox, pin EN-EL25, sạc zin',
    location: '74 Bà Triệu',
    staff: 'Trần Văn Nam',
    condition: 96,
    description: 'Máy vlog không viewfinder, flip màn hình cực tiện, AF bám mắt mượt mà.',
    dateAdded: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '57490',
    brand: 'NIKON',
    name: 'Z6 III',
    specs: 'Black, Body, Fullbox / 57490',
    price: 58000000,
    status: PRODUCT_STATUS.DEPOSITED,
    color: '#000000',
    box: true,
    lens: false,
    serial: '11209',
    shotCount: '2.900',
    accessories: 'Fullbox đầy đủ, thêm grip MB-N14',
    location: '193 Giảng Võ',
    staff: 'Lê Hồng Quân',
    condition: 99,
    description: 'Cảm biến BSI CMOS 24.5MP, quay 6K RAW nội 12-bit, EVF 5.76 triệu điểm đỉnh nhất phân khúc.',
    dateAdded: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    depositInfo: {
      staff: 'Lê Hồng Quân',
      location: '193 Giảng Võ',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  },

  // ── RICOH ──
  {
    id: '58490',
    brand: 'RICOH',
    name: 'GR IIIx',
    specs: 'Black, Body, No box / 58490',
    price: 27900000,
    status: PRODUCT_STATUS.DEPOSITED,
    color: '#000000',
    box: false,
    lens: true,
    serial: '20019',
    shotCount: '6.200',
    accessories: 'Sạc, 2 Pin DB-110, dây đeo tay da cao cấp',
    location: '193 NBK',
    staff: 'Nguyễn Việt Thịnh',
    condition: 95,
    description: 'Ống kính 40mm f/2.8 góc trung tính, ngoại hình xước dăm đế máy nhưng thấu kính sạch hoàn toàn.',
    dateAdded: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    depositInfo: {
      staff: 'Nguyễn Việt Thịnh',
      location: '193 NBK',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  },

  // ── SIGMA ──
  {
    id: '59490',
    brand: 'SIGMA',
    name: '18-50mm f/2.8 DC DN Contemporary (Fuji X)',
    specs: 'Black, Lens, Fullbox / 59490',
    price: 9800000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#000000',
    box: true,
    lens: true,
    serial: '91028',
    shotCount: '0',
    accessories: 'Fullbox, nắp trước sau zin, hood, túi đựng',
    location: '193 Giảng Võ',
    staff: 'Lê Hồng Quân',
    condition: 99,
    description: 'Lens zoom khẩu lớn APS-C nhỏ gọn bậc nhất cho Fuji X, kính trong vắt không tì vết.',
    dateAdded: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },

  // ── TAMRON ──
  {
    id: '60490',
    brand: 'TAMRON',
    name: '17-28mm f/2.8 Di III RXD (Sony E)',
    specs: 'Black, Lens, Fullbox / 60490',
    price: 14200000,
    status: PRODUCT_STATUS.SOLD,
    color: '#000000',
    box: true,
    lens: true,
    serial: '80291',
    shotCount: '0',
    accessories: 'Fullbox phụ kiện zin, kính lọc UV 67mm',
    location: '193 NBK',
    staff: 'Nguyễn Việt Thịnh',
    condition: 97,
    description: 'Wide-angle zoom khẩu f/2.8, siêu nhẹ chỉ 420g, kính đẹp không mốc.',
    dateAdded: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    sellInfo: {
      staff: 'Nguyễn Việt Thịnh',
      location: '193 NBK',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    }
  },

  // ── VILTROX ──
  {
    id: '61490',
    brand: 'VILTROX',
    name: '56mm f/1.4 AF STM (Fuji X)',
    specs: 'Black, Lens, Fullbox / 61490',
    price: 5200000,
    status: PRODUCT_STATUS.SOLD,
    color: '#000000',
    box: true,
    lens: true,
    serial: '62019',
    shotCount: '0',
    accessories: 'Fullbox, hood, túi đựng lens, nắp UV',
    location: '42 Huỳnh Thúc Kháng',
    staff: 'Đỗ Minh Trí',
    condition: 98,
    description: 'Chân dung 56mm f/1.4 cho Fuji X, bokeh mịn đẹp, AF nhanh im lặng, như mới.',
    dateAdded: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    sellInfo: {
      staff: 'Đỗ Minh Trí',
      location: '42 Huỳnh Thúc Kháng',
      date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
    }
  },

  // ── LEICA ──
  {
    id: '62490',
    brand: 'LEICA',
    name: 'M11 Monochrom',
    specs: 'Black Paint, Rangefinder, Fullbox / 62490',
    price: 210000000,
    status: PRODUCT_STATUS.SOLD,
    color: '#1a1a1a',
    box: true,
    lens: false,
    serial: '19920',
    shotCount: '1.500',
    accessories: 'Fullbox đầy đủ phụ kiện Leica, dây đeo da Leica gốc',
    location: '193 Giảng Võ',
    staff: 'Lê Hồng Quân',
    condition: 99,
    description: 'Cảm biến 60MP Monochrom thuần đen trắng độc nhất vô nhị, độ phân giải dải động đỉnh cao.',
    dateAdded: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    sellInfo: {
      staff: 'Lê Hồng Quân',
      location: '193 Giảng Võ',
      date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
    }
  },

  // ── HASSELBLAD ──
  {
    id: '63490',
    brand: 'HASSELBLAD',
    name: '907X 50C',
    specs: 'Silver, Medium Format, Fullbox / 63490',
    price: 145000000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#c0c0c0',
    box: true,
    lens: false,
    serial: '30192',
    shotCount: '400',
    accessories: 'Fullbox, ngàm XCD adapter, sạc zin',
    location: '193 Giảng Võ',
    staff: 'Lê Hồng Quân',
    condition: 99,
    description: 'Thiết kế tối giản iconic, cảm biến 50MP Medium Format, hàng hiếm thị trường Việt Nam.',
    dateAdded: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },

  // ── FUJI bổ sung ──
  {
    id: '64490',
    brand: 'FUJI',
    name: 'X-E4',
    specs: 'Silver, Body, No box / 64490',
    price: 18900000,
    status: PRODUCT_STATUS.SOLD,
    color: '#c0c0c0',
    box: false,
    lens: false,
    serial: '29182',
    shotCount: '9.000',
    accessories: 'Sạc, 1 Pin zin, ốp da nâu aftermarket',
    location: '193 Giảng Võ',
    staff: 'Lê Hồng Quân',
    condition: 93,
    description: 'Thiết kế mỏng dẹp hoài cổ, film simulation đỉnh cao, xước dăm nhẹ nắp sau.',
    dateAdded: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    sellInfo: {
      staff: 'Lê Hồng Quân',
      location: '193 Giảng Võ',
      date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: '65490',
    brand: 'FUJI',
    name: 'GFX 50S II',
    specs: 'Black, Medium Format Body, Fullbox / 65490',
    price: 72000000,
    status: PRODUCT_STATUS.DEPOSITED,
    color: '#000000',
    box: true,
    lens: false,
    serial: '30029',
    shotCount: '2.200',
    accessories: 'Fullbox, sạc đôi, 2 pin NP-T125 zin',
    location: '193 NBK',
    staff: 'Nguyễn Việt Thịnh',
    condition: 97,
    description: 'Medium Format 51.4MP IBIS, màu sắc Fuji chân thực tuyệt vời, xước dăm rất nhẹ đáy máy.',
    dateAdded: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    depositInfo: {
      staff: 'Nguyễn Việt Thịnh',
      location: '193 NBK',
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
    }
  },

  // ── PHỤ KIỆN bổ sung ──
  {
    id: '66490',
    brand: 'PHỤ KIỆN',
    name: 'Flash Godox V1 Pro (Sony)',
    specs: 'Black, Flash, Fullbox / 66490',
    price: 4200000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#000000',
    box: true,
    lens: false,
    serial: 'GX-V1P-9201',
    shotCount: '0',
    accessories: 'Fullbox, pin Li-ion VB26A, sạc nhanh USB-C',
    location: '193 NBK',
    staff: 'Nguyễn Việt Thịnh',
    condition: 99,
    description: 'Flash đầu xoay tròn 76Ws, HSS 1/8000s, TTL Sony, sạc nhanh đầy pin 1.5 tiếng, như mới.',
    dateAdded: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '67490',
    brand: 'PHỤ KIỆN',
    name: 'Túi máy Lowepro Flipside 400 AW III',
    specs: 'Black, Backpack, Fullbox / 67490',
    price: 3100000,
    status: PRODUCT_STATUS.SOLD,
    color: '#000000',
    box: true,
    lens: false,
    serial: 'LP-FA400-8291',
    shotCount: '0',
    accessories: 'Túi mưa AW, khoá TSA, móc túi phụ',
    location: '74 Bà Triệu',
    staff: 'Trần Văn Nam',
    condition: 96,
    description: 'Ba lô đựng máy ảnh + laptop 15", vải chống nước, ngăn chứa rộng rãi, xước dăm nhẹ khoá kéo.',
    dateAdded: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString(),
    sellInfo: {
      staff: 'Trần Văn Nam',
      location: '74 Bà Triệu',
      date: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: '68490',
    brand: 'PHỤ KIỆN',
    name: 'Kính lọc Kase Wolverine CPL 82mm',
    specs: 'Silver, Filter, Fullbox / 68490',
    price: 1850000,
    status: PRODUCT_STATUS.IN_STOCK,
    color: '#c0c0c0',
    box: true,
    lens: false,
    serial: 'KS-CPL82-1029',
    shotCount: '0',
    accessories: 'Hộp nhôm đựng filter, khăn lau kính',
    location: '42 Huỳnh Thúc Kháng',
    staff: 'Đỗ Minh Trí',
    condition: 99,
    description: 'Kính CPL cao cấp Schott MRC Nano 28 lớp phủ, khử phản xạ đỉnh cao, kính không trầy.',
    dateAdded: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// ── Real product photos (keyed by product id) ──
const PRODUCT_PHOTOS = {
  // FUJI
  '37490': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Fujifilm_X-M5_-_1.jpg/600px-Fujifilm_X-M5_-_1.jpg',
  '37491': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Fujifilm_X-T5_4_nov_2022a.jpg/600px-Fujifilm_X-T5_4_nov_2022a.jpg',
  '37492': 'https://fujifilm-x.b-cdn.net/wp-content/uploads/2021/09/x-t30-ii_thum_bxyg.jpg',
  '37493': 'https://fujifilm-x.b-cdn.net/wp-content/uploads/2023/05/dwga_x-s20_thum.jpg',
  '37494': 'https://fujifilm-x.b-cdn.net/wp-content/uploads/2024/02/stjw_x100vi_thum.jpg',
  '37495': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Fujifilm_X_Pro3.jpg/600px-Fujifilm_X_Pro3.jpg',
  '64490': 'https://fujifilm-x.b-cdn.net/wp-content/uploads/2021/01/x-e4_thumbnail_gkac.jpg',
  '65490': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Fujifilm_GFX50S_II_10_nov_2021a.jpg/600px-Fujifilm_GFX50S_II_10_nov_2021a.jpg',
  // SONY
  '38490': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Sony_A7_IV_%28ILCE-7M4%29_-_by_Henry_S%C3%B6derlund_%2851739988735%29.jpg/600px-Sony_A7_IV_%28ILCE-7M4%29_-_by_Henry_S%C3%B6derlund_%2851739988735%29.jpg',
  '49490': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Sony_ILCE-7CM2_8_nov_2023a.jpg/600px-Sony_ILCE-7CM2_8_nov_2023a.jpg',
  '50490': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Sony_ZV-E10_with_Sony_E_16-50mm_F3.5-5.6_OSS_PZ_-_by_Henry_S%C3%B6derlund_%2851375243603%29.jpg/600px-Sony_ZV-E10_with_Sony_E_16-50mm_F3.5-5.6_OSS_PZ_-_by_Henry_S%C3%B6derlund_%2851375243603%29.jpg',
  '51490': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Sony_FX30_with_Sony_E_10-20mm_F4_PZ_G_-_by_Henry_S%C3%B6derlund_%2852445895581%29.jpg/600px-Sony_FX30_with_Sony_E_10-20mm_F4_PZ_G_-_by_Henry_S%C3%B6derlund_%2852445895581%29.jpg',
  // CANON
  '39490': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Canon_EOS_R6_Mark_II_9_jan_2023a.jpg/600px-Canon_EOS_R6_Mark_II_9_jan_2023a.jpg',
  '52490': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Canon_EOS_R50_Black.jpg/600px-Canon_EOS_R50_Black.jpg',
  '53490': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Canon_EOS_R5_Mark_II-8774.jpg/600px-Canon_EOS_R5_Mark_II-8774.jpg',
  // DJI
  '40490': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/DJI_Osmo_Pocket_3_-_1.jpg/600px-DJI_Osmo_Pocket_3_-_1.jpg',
  '54490': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/2024_Dron_DJI_Mini_4_Pro_%2801%29.jpg/600px-2024_Dron_DJI_Mini_4_Pro_%2801%29.jpg',
  '55490': '/images/dji_rs4_pro.png',
  // NIKON
  '41490': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Nikon_Z_fc_3_aug_2021a.jpg/600px-Nikon_Z_fc_3_aug_2021a.jpg',
  '56490': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Nikon_Z30.jpg/600px-Nikon_Z30.jpg',
  '57490': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Nikon_Z6III_13_jul_2024a.jpg/600px-Nikon_Z6III_13_jul_2024a.jpg',
  // RICOH
  '42490': 'https://us.ricoh-imaging.com/wp-content/uploads/2019/04/gr-iii-500.jpg',
  '58490': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/RICOH_GR_III_x_camera.jpg/600px-RICOH_GR_III_x_camera.jpg',
  // SIGMA
  '43490': 'https://www.sigmaphoto.com/media/catalog/product/cache/9d3f19d3b6579f1b9ef73ec013fd6bc2/a/0/a019_24_70_28_basic_3.png',
  '59490': 'https://www.sigmaphoto.com/media/catalog/product/cache/9d3f19d3b6579f1b9ef73ec013fd6bc2/c/0/c021_18_50_28_basic_01_4.png',
  // TAMRON
  '44490': 'https://www.tamron.com/jp/consumer/pc_file/file/a063_01_pc.png',
  '60490': 'https://www.tamron.com/jp/consumer/pc_file/file/a046_img01.jpg',
  // VILTROX
  '45490': '/images/viltrox_85mm.png',
  '61490': 'https://viltrox.com/cdn/shop/files/AF56mm_F1.4_XF-789704.png?v=1722921088',
  // LEICA
  '46490': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Leica_Q2_-_front_view_-_by_Henry_S%C3%B6derlund_%2852561697609%29.jpg/600px-Leica_Q2_-_front_view_-_by_Henry_S%C3%B6derlund_%2852561697609%29.jpg',
  '62490': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Leica_M11_Monochrom_L1000451.jpg/600px-Leica_M11_Monochrom_L1000451.jpg',
  // HASSELBLAD
  '47490': 'https://store-na.hasselblad.com/cdn/shop/files/X2D_692x692_4x_cecaf8af-26d4-461a-9eaa-7f90ea4647ab_330x330.png',
  '63490': 'https://store-na.hasselblad.com/cdn/shop/files/907X.jpg',
  // PHỤ KIỆN
  '48490': '/images/peak_design_tripod.png',
  '66490': 'https://strobepro.com/cdn/shop/files/Godox_V1_Pro_flash_speedlite_strobepro_1_f860482f-6262-4db9-83dd-8643411caec0_5000x.jpg?v=1705606862',
  '67490': 'https://cdn.lowepro.com/media/catalog/product/cache/29dcb5ccf179293005728ddc618b5922/c/a/camera-backpack-lowepro--flipside-iii-lp37352-pww.jpg',
  '68490': 'https://kaseoptics.com/cdn/shop/files/1121600001.jpg?v=1684937445',
};

const INITIAL_HISTORY = [
  // ── Hôm nay / gần đây nhất ──
  {
    id: 'hist_01',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Đỗ Minh Trí',
    location: '42 Huỳnh Thúc Kháng',
    productName: 'Kase Wolverine CPL 82mm',
    serial: 'KS-CPL82-1029',
    details: 'Nhập kho kính lọc Kase Wolverine CPL 82mm ngoại hình 99% bởi Đỗ Minh Trí.'
  },
  {
    id: 'hist_02',
    type: LOG_TYPE.DEPOSIT,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Nguyễn Việt Thịnh',
    location: '193 NBK',
    productName: 'RICOH GR IIIx',
    serial: '20019',
    details: 'Xác nhận khách nhận cọc máy RICOH GR IIIx (Serial: 20019) cho khách của Nguyễn Việt Thịnh tại chi nhánh 193 NBK.'
  },
  {
    id: 'hist_03',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Lê Hồng Quân',
    location: '193 Giảng Võ',
    productName: 'HASSELBLAD 907X 50C',
    serial: '30192',
    details: 'Nhập kho máy cũ HASSELBLAD 907X 50C ngoại hình 99% bởi Lê Hồng Quân.'
  },
  {
    id: 'hist_04',
    type: LOG_TYPE.DEPOSIT,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Lê Hồng Quân',
    location: '193 Giảng Võ',
    productName: 'NIKON Z6 III',
    serial: '11209',
    details: 'Xác nhận khách nhận cọc máy NIKON Z6 III (Serial: 11209) cho khách của Lê Hồng Quân tại chi nhánh 193 Giảng Võ.'
  },
  {
    id: 'hist_05',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Lê Hồng Quân',
    location: '193 Giảng Võ',
    productName: 'DJI Mini 4 Pro Fly More Combo Plus',
    serial: '89201',
    details: 'Nhập kho máy DJI Mini 4 Pro Fly More Combo Plus ngoại hình 99% bởi Lê Hồng Quân.'
  },
  {
    id: 'hist_06',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Nguyễn Việt Thịnh',
    location: '193 NBK',
    productName: 'DJI Osmo Pocket 3 Creator Combo',
    serial: '88102',
    details: 'Nhập kho máy DJI Osmo Pocket 3 Creator Combo ngoại hình 99%.'
  },
  {
    id: 'hist_07',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Trần Văn Nam',
    location: '74 Bà Triệu',
    productName: 'SONY ZV-E10 II',
    serial: '71029',
    details: 'Nhập kho máy cũ SONY ZV-E10 II ngoại hình 99% bởi Trần Văn Nam.'
  },
  {
    id: 'hist_08',
    type: LOG_TYPE.DEPOSIT,
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Trần Văn Nam',
    location: '74 Bà Triệu',
    productName: 'SONY ZV-E10 II',
    serial: '71029',
    details: 'Xác nhận khách nhận cọc máy SONY ZV-E10 II (Serial: 71029) cho khách của Trần Văn Nam tại chi nhánh 74 Bà Triệu.'
  },
  {
    id: 'hist_09',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Nguyễn Việt Thịnh',
    location: '193 NBK',
    productName: 'FUJI X-M5',
    serial: '37428',
    details: 'Nhập kho máy cũ Fuji X-M5 ngoại hình 97%.'
  },
  {
    id: 'hist_10',
    type: LOG_TYPE.DEPOSIT,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Nguyễn Việt Thịnh',
    location: '193 NBK',
    productName: 'DJI RS 4 Pro',
    serial: '90102',
    details: 'Xác nhận khách nhận cọc máy DJI RS 4 Pro (Serial: 90102) cho khách của Nguyễn Việt Thịnh tại chi nhánh 193 NBK.'
  },
  {
    id: 'hist_11',
    type: LOG_TYPE.DEPOSIT,
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Nguyễn Việt Thịnh',
    location: '193 NBK',
    productName: 'FUJI GFX 50S II',
    serial: '30029',
    details: 'Xác nhận khách nhận cọc máy FUJI GFX 50S II (Serial: 30029) cho khách của Nguyễn Việt Thịnh tại chi nhánh 193 NBK.'
  },
  {
    id: 'hist_12',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Nguyễn Việt Thịnh',
    location: '193 NBK',
    productName: 'Flash Godox V1 Pro (Sony)',
    serial: 'GX-V1P-9201',
    details: 'Nhập kho Flash Godox V1 Pro (Sony) ngoại hình 99% bởi Nguyễn Việt Thịnh.'
  },
  {
    id: 'hist_13',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Lê Hồng Quân',
    location: '193 Giảng Võ',
    productName: 'NIKON Z6 III',
    serial: '11209',
    details: 'Nhập kho máy cũ NIKON Z6 III ngoại hình 99% bởi Lê Hồng Quân.'
  },
  {
    id: 'hist_14',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Lê Hồng Quân',
    location: '193 Giảng Võ',
    productName: 'FUJI GFX 50S II',
    serial: '30029',
    details: 'Nhập kho máy cũ FUJI GFX 50S II ngoại hình 97% bởi Lê Hồng Quân.'
  },
  {
    id: 'hist_15',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Lê Hồng Quân',
    location: '193 Giảng Võ',
    productName: 'DJI RS 4 Pro',
    serial: '90102',
    details: 'Nhập kho gimbal DJI RS 4 Pro ngoại hình 98% bởi Lê Hồng Quân.'
  },
  {
    id: 'hist_16',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Nguyễn Việt Thịnh',
    location: '193 NBK',
    productName: 'RICOH GR IIIx',
    serial: '20019',
    details: 'Nhập kho máy cũ RICOH GR IIIx ngoại hình 95% bởi Nguyễn Việt Thịnh.'
  },
  {
    id: 'hist_17',
    type: LOG_TYPE.SELL,
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Đỗ Minh Trí',
    location: '42 Huỳnh Thúc Kháng',
    productName: 'VILTROX 56mm f/1.4 AF STM (Fuji X)',
    serial: '62019',
    details: 'Xác nhận đã bán lens VILTROX 56mm f/1.4 AF STM (Serial: 62019) cho khách, thực hiện bởi Đỗ Minh Trí tại chi nhánh 42 Huỳnh Thúc Kháng.'
  },
  {
    id: 'hist_18',
    type: LOG_TYPE.SELL,
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Trần Văn Nam',
    location: '74 Bà Triệu',
    productName: 'CANON EOS R5 Mark II',
    serial: '81029',
    details: 'Xác nhận đã bán máy CANON EOS R5 Mark II (Serial: 81029) cho khách, thực hiện bởi Trần Văn Nam tại chi nhánh 74 Bà Triệu.'
  },
  {
    id: 'hist_19',
    type: LOG_TYPE.SYSTEM,
    date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Hệ thống',
    location: '193 Giảng Võ',
    productName: 'SONY A7 IV',
    serial: '66182',
    details: 'Hệ thống tự động hủy cọc quá hạn 1 tuần (đặt bởi Lê Hồng Quân tại 193 Giảng Võ). Máy SONY A7 IV đã trả về trạng thái Còn hàng.'
  },
  {
    id: 'hist_20',
    type: LOG_TYPE.SELL,
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Nguyễn Việt Thịnh',
    location: '193 NBK',
    productName: 'TAMRON 17-28mm f/2.8 Di III RXD (Sony E)',
    serial: '80291',
    details: 'Xác nhận đã bán lens TAMRON 17-28mm f/2.8 (Serial: 80291) cho khách, thực hiện bởi Nguyễn Việt Thịnh tại chi nhánh 193 NBK.'
  },
  {
    id: 'hist_21',
    type: LOG_TYPE.SELL,
    date: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Trần Văn Nam',
    location: '74 Bà Triệu',
    productName: 'PHỤ KIỆN Lowepro Flipside 400 AW III',
    serial: 'LP-FA400-8291',
    details: 'Xác nhận đã bán túi Lowepro Flipside 400 AW III (Serial: LP-FA400-8291) cho khách, thực hiện bởi Trần Văn Nam tại chi nhánh 74 Bà Triệu.'
  },
  {
    id: 'hist_22',
    type: LOG_TYPE.SELL,
    date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Lê Hồng Quân',
    location: '193 Giảng Võ',
    productName: 'SONY FX30',
    serial: '72910',
    details: 'Xác nhận đã bán máy SONY FX30 (Serial: 72910) cho khách, thực hiện bởi Lê Hồng Quân tại chi nhánh 193 Giảng Võ.'
  },
  {
    id: 'hist_23',
    type: LOG_TYPE.SELL,
    date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Lê Hồng Quân',
    location: '193 Giảng Võ',
    productName: 'LEICA M11 Monochrom',
    serial: '19920',
    details: 'Xác nhận đã bán máy LEICA M11 Monochrom (Serial: 19920) cho khách, thực hiện bởi Lê Hồng Quân tại chi nhánh 193 Giảng Võ.'
  },
  {
    id: 'hist_24',
    type: LOG_TYPE.SYSTEM,
    date: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Hệ thống',
    location: '193 NBK',
    productName: 'FUJI X-T5',
    serial: '38192',
    details: 'Hệ thống tự động hủy cọc quá hạn 1 tuần (đặt bởi Nguyễn Việt Thịnh tại 193 NBK). Máy FUJI X-T5 đã trả về trạng thái Còn hàng.'
  },
  {
    id: 'hist_25',
    type: LOG_TYPE.SELL,
    date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Lê Hồng Quân',
    location: '193 Giảng Võ',
    productName: 'FUJI X-E4',
    serial: '29182',
    details: 'Xác nhận đã bán máy FUJI X-E4 (Serial: 29182) cho khách, thực hiện bởi Lê Hồng Quân tại chi nhánh 193 Giảng Võ.'
  },
  {
    id: 'hist_26',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Trần Văn Nam',
    location: '74 Bà Triệu',
    productName: 'CANON EOS R5 Mark II',
    serial: '81029',
    details: 'Nhập kho máy cũ CANON EOS R5 Mark II ngoại hình 99% bởi Trần Văn Nam.'
  },
  {
    id: 'hist_27',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Trần Văn Nam',
    location: '74 Bà Triệu',
    productName: 'PHỤ KIỆN Lowepro Flipside 400 AW III',
    serial: 'LP-FA400-8291',
    details: 'Nhập kho túi Lowepro Flipside 400 AW III ngoại hình 96% bởi Trần Văn Nam.'
  },
  {
    id: 'hist_28',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Lê Hồng Quân',
    location: '193 Giảng Võ',
    productName: 'FUJI X-E4',
    serial: '29182',
    details: 'Nhập kho máy cũ FUJI X-E4 ngoại hình 93% bởi Lê Hồng Quân.'
  },
  {
    id: 'hist_29',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Đỗ Minh Trí',
    location: '42 Huỳnh Thúc Kháng',
    productName: 'VILTROX 56mm f/1.4 AF STM (Fuji X)',
    serial: '62019',
    details: 'Nhập kho lens VILTROX 56mm f/1.4 AF STM (Fuji X) ngoại hình 98% bởi Đỗ Minh Trí.'
  },
  {
    id: 'hist_30',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Lê Hồng Quân',
    location: '193 Giảng Võ',
    productName: 'SONY FX30',
    serial: '72910',
    details: 'Nhập kho máy cũ SONY FX30 Cinema Line ngoại hình 98% bởi Lê Hồng Quân.'
  },
  {
    id: 'hist_31',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Lê Hồng Quân',
    location: '193 Giảng Võ',
    productName: 'LEICA M11 Monochrom',
    serial: '19920',
    details: 'Nhập kho máy cũ LEICA M11 Monochrom ngoại hình 99% bởi Lê Hồng Quân.'
  },
  {
    id: 'hist_32',
    type: LOG_TYPE.IMPORT,
    date: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    staff: 'Nguyễn Việt Thịnh',
    location: '193 NBK',
    productName: 'TAMRON 17-28mm f/2.8 Di III RXD (Sony E)',
    serial: '80291',
    details: 'Nhập kho lens TAMRON 17-28mm f/2.8 Di III RXD (Sony E) ngoại hình 97% bởi Nguyễn Việt Thịnh.'
  }
];

// FIX #3: Reusable status label/class lookup — eliminates repeated if-else chains
const STATUS_DISPLAY = {
  [PRODUCT_STATUS.IN_STOCK]:  { text: 'Còn hàng', cls: 'status-con' },
  [PRODUCT_STATUS.DEPOSITED]: { text: 'Đã cọc',   cls: 'status-coc' },
  [PRODUCT_STATUS.SOLD]:      { text: 'Đã bán',   cls: 'status-ban' },
};

const LOG_DISPLAY = {
  [LOG_TYPE.IMPORT]:  { text: 'NHẬP KHO', cls: 'type-nhap' },
  [LOG_TYPE.DEPOSIT]: { text: 'CỌC MÁY',  cls: 'type-coc'  },
  [LOG_TYPE.SELL]:    { text: 'ĐÃ BÁN',   cls: 'type-ban'  },
  [LOG_TYPE.SYSTEM]:  { text: 'HỆ THỐNG', cls: 'type-system' },
};

// FIX #8: Download utility extracted out of JSX/handlers
function triggerJsonDownload(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

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
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [collapsedGroups, setCollapsedGroups] = useState(new Set());
  const [activeThumbIndex, setActiveThumbIndex] = useState(0);

  // Modals state
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [mDepStaff, setMDepStaff] = useState(STAFFS[0]);
  const [mDepLocation, setMDepLocation] = useState(LOCATIONS[0]);
  const [mDepCustomerName, setMDepCustomerName] = useState('');
  const [mDepCustomerPhone, setMDepCustomerPhone] = useState('');
  const [mDepAmount, setMDepAmount] = useState('');

  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [mSellStaff, setMSellStaff] = useState(STAFFS[0]);
  const [mSellLocation, setMSellLocation] = useState(LOCATIONS[0]);
  const [mSellCustomerName, setMSellCustomerName] = useState('');
  const [mSellCustomerPhone, setMSellCustomerPhone] = useState('');
  const [mSellActualPrice, setMSellActualPrice] = useState('');

  // Entry form state (NHẬP LIỆU)
  const [fBrand, setFBrand] = useState('FUJI');
  const [fName, setFName] = useState('');
  const [fColor, setFColor] = useState('#000000');
  const [fColorName, setFColorName] = useState('Black');
  const [fPrice, setFPrice] = useState('');
  const [fSerial, setFSerial] = useState('');
  const [fShot, setFShot] = useState('');
  const [fLocation, setFLocation] = useState(LOCATIONS[0]);
  const [fStaff, setFStaff] = useState(STAFFS[0]);
  const [fCondition, setFCondition] = useState(97);
  const [fBox, setFBox] = useState(false);
  const [fLensName, setFLensName] = useState('');
  const [fAccessories, setFAccessories] = useState('');
  const [fDesc, setFDesc] = useState('');
  const [fImages, setFImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [productImages, setProductImages] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nippon_camera_images') || '{}'); }
    catch { return {}; }
  });

  const [toast, setToast] = useState(null);
  const [failedImages, setFailedImages] = useState(new Set());

  // History search state
  const [historyQuery, setHistoryQuery] = useState('');
  const [historyTypeFilter, setHistoryTypeFilter] = useState('');
  const [historyFromDate, setHistoryFromDate] = useState('');
  const [historyToDate, setHistoryToDate] = useState('');
  const [expandedLogId, setExpandedLogId] = useState(null);

  // Stats period filter
  const [statsPeriod, setStatsPeriod] = useState('all');

  // Edit product state
  const [editMode, setEditMode] = useState(false);
  const [editDraft, setEditDraft] = useState(null);

  // Delete product state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [releaseConfirmOpen, setReleaseConfirmOpen] = useState(false);
  const [mReleaseStaff, setMReleaseStaff] = useState(STAFFS[0]);

  // FIX #5 & #8: Refs instead of DOM queries
  const toastTimerRef = useRef(null);
  const importFileRef = useRef(null);
  const imageInputRef = useRef(null);

  // NOTE: The following localStorage sync is only for demo purposes.
  // When a real backend DB is integrated, data will be persisted server‑side
  // and these sync calls can be removed.
  // Sync to local storage (with quota guard)
  const safeLocalStorageSet = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      if (e?.name === 'QuotaExceededError' || e?.code === 22) {
        showToast('Bộ nhớ thiết bị đã đầy! Hãy xuất JSON backup và xoá bớt dữ liệu.', 'error');
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { safeLocalStorageSet('nippon_camera_products', JSON.stringify(products)); }, [products]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { safeLocalStorageSet('nippon_camera_history', JSON.stringify(history)); }, [history]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { safeLocalStorageSet('nippon_camera_images', JSON.stringify(productImages)); }, [productImages]);

  // FIX #5: Clear toast timer on unmount to prevent memory leak
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // FIX #1 & #7: Pure map — collect expired logs first, then batch-update both states
  useEffect(() => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const now = new Date().toISOString();
    const expiredLogs = [];

    const updatedProducts = products.map(p => {
      if (p.status === PRODUCT_STATUS.DEPOSITED && p.depositInfo?.date) {
        const depositTime = new Date(p.depositInfo.date).getTime();
        if (depositTime < oneWeekAgo) {
          expiredLogs.push({
            id: `hist_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            type: LOG_TYPE.SYSTEM,
            date: now,
            staff: 'Hệ thống',
            location: p.depositInfo.location,
            productName: `${p.brand} ${p.name}`,
            serial: p.serial,
            details: `Hệ thống tự động hủy cọc quá hạn 1 tuần (đặt bởi ${p.depositInfo.staff} tại ${p.depositInfo.location})`
          });
          // FIX: destructure instead of mutating with delete
          // eslint-disable-next-line no-unused-vars
          const { depositInfo: _ignored, ...rest } = p;
          return { ...rest, status: PRODUCT_STATUS.IN_STOCK };
        }
      }
      return p;
    });

    if (expiredLogs.length > 0) {
      // eslint-disable-next-line
      setProducts(updatedProducts);
      setHistory(prev => [...expiredLogs, ...prev]);
    }
    // products is stable at mount (read from localStorage before this effect runs).
    // Intentionally run once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helpers — function declaration so safeLocalStorageSet can reference it via hoisting
  function showToast(message, type = 'success') {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => setToast(null), 3000);
  }

  const compressImageFile = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 1200;
        let w = img.width, h = img.height;
        if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

  const handleImageFiles = (files) => {
    const allowed = Array.from(files).filter(f => f.type.startsWith('image/'));
    const entries = allowed.map(f => ({
      id: `img_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      file: f,
      name: f.name,
      size: f.size,
      preview: URL.createObjectURL(f),
    }));
    setFImages(prev => [...prev, ...entries]);
  };

  const handleImageRemove = (idx) => {
    setFImages(prev => {
      URL.revokeObjectURL(prev[idx]?.preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const getProductPhoto = (productId) => {
    const imgs = productImages[productId];
    if (imgs && imgs.length > 0) return imgs[0];
    return PRODUCT_PHOTOS[productId] || null;
  };

  const getProductPhotoList = (productId) => {
    const imgs = productImages[productId];
    if (imgs && imgs.length > 0) return imgs;
    // Try a local image file first (public/images/<productId>.jpg)
    const localPath = `/images/${productId}.jpg`;
    const externalList = [];
    const single = PRODUCT_PHOTOS[productId];
    if (single) externalList.push(single);
    // Return the local path (if exists) plus any external fallback URLs
    return [localPath, ...externalList];
  };

  const formatMoneyRaw = (num) => num.toLocaleString('vi-VN');
  const formatMoney = (num) => num.toLocaleString('vi-VN') + ' đ';

  const formatDate = (isoStr) => {
    const d = new Date(isoStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const formatRevenue = (num) => {
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1).replace('.', ',')} tỷ`;
    if (num >= 1_000_000)     return `${(num / 1_000_000).toFixed(1).replace('.', ',')} triệu`;
    return num.toLocaleString('vi-VN') + ' đ';
  };

  const addLog = (type, staff, location, productName, serial, details) => {
    const newLog = {
      id: `hist_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
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

  // FIX #1: No setState calls inside .map() — derive updated product, then set states separately
  const handleConfirmDeposit = (e) => {
    e.preventDefault();
    if (!currentProduct) return;

    const depositInfo = {
      staff: mDepStaff,
      location: mDepLocation,
      date: new Date().toISOString(),
      customerName: mDepCustomerName,
      customerPhone: mDepCustomerPhone,
      amount: parseInt(mDepAmount, 10)
    };
    let updatedProduct;

    setProducts(prev => prev.map(p => {
      if (p.id === currentProduct.id) {
        updatedProduct = { ...p, status: PRODUCT_STATUS.DEPOSITED, depositInfo };
        return updatedProduct;
      }
      return p;
    }));

    const target = { ...currentProduct, status: PRODUCT_STATUS.DEPOSITED, depositInfo };
    setCurrentProduct(target);

    addLog(
      LOG_TYPE.DEPOSIT,
      mDepStaff,
      mDepLocation,
      `${currentProduct.brand} ${currentProduct.name}`,
      currentProduct.serial,
      `Xác nhận khách nhận cọc máy ${currentProduct.brand} ${currentProduct.name} (Serial: ${currentProduct.serial}) cho khách của ${mDepStaff} tại chi nhánh ${mDepLocation}. Khách: ${mDepCustomerName} (${mDepCustomerPhone}), tiền cọc: ${parseInt(mDepAmount, 10).toLocaleString('vi-VN')}đ.`
    );

    showToast(`Đã nhận cọc máy ${currentProduct.name} thành công!`);
    setMDepCustomerName('');
    setMDepCustomerPhone('');
    setMDepAmount('');
    setDepositModalOpen(false);
  };

  // FIX #1: Same pattern for sell
  const handleConfirmSell = (e) => {
    e.preventDefault();
    if (!currentProduct) return;

    const actualPrice = parseInt(mSellActualPrice, 10) || currentProduct.price;
    const sellInfo = {
      staff: mSellStaff,
      location: mSellLocation,
      date: new Date().toISOString(),
      customerName: mSellCustomerName,
      customerPhone: mSellCustomerPhone,
      actualPrice,
    };

    setProducts(prev => prev.map(p => {
      if (p.id !== currentProduct.id) return p;
      // eslint-disable-next-line no-unused-vars
      const { depositInfo: _d, ...rest } = p;
      return { ...rest, status: PRODUCT_STATUS.SOLD, sellInfo };
    }));

    setCurrentProduct(prev => {
      // eslint-disable-next-line no-unused-vars
      const { depositInfo: _d, ...rest } = prev;
      return { ...rest, status: PRODUCT_STATUS.SOLD, sellInfo };
    });

    const discount = currentProduct.price - actualPrice;
    const discountNote = discount > 0 ? `, giảm giá ${formatMoney(discount)}` : '';
    addLog(
      LOG_TYPE.SELL,
      mSellStaff,
      mSellLocation,
      `${currentProduct.brand} ${currentProduct.name}`,
      currentProduct.serial,
      `Đã bán máy ${currentProduct.brand} ${currentProduct.name} (Serial: ${currentProduct.serial}) cho khách ${mSellCustomerName} (${mSellCustomerPhone}), giá bán ${formatMoney(actualPrice)}${discountNote}. NV: ${mSellStaff} tại ${mSellLocation}.`
    );

    showToast(`Đã bán máy ${currentProduct.name} thành công!`);
    setMSellCustomerName('');
    setMSellCustomerPhone('');
    setMSellActualPrice('');
    setSellModalOpen(false);
  };

  // FIX #1: Functional update + destructure instead of delete mutation
  const handleReleaseProduct = () => {
    if (!currentProduct) return;

    const prevStatus = currentProduct.status;
    const actionLabel = prevStatus === PRODUCT_STATUS.DEPOSITED ? 'Hủy cọc' : 'Reset về còn hàng';
    // eslint-disable-next-line no-unused-vars
    const { depositInfo: _d, sellInfo: _s, ...rest } = currentProduct;
    const released = { ...rest, status: PRODUCT_STATUS.IN_STOCK };

    setProducts(prev => prev.map(p => p.id === currentProduct.id ? released : p));
    setCurrentProduct(released);

    addLog(
      LOG_TYPE.SYSTEM,
      mReleaseStaff,
      currentProduct.location,
      `${currentProduct.brand} ${currentProduct.name}`,
      currentProduct.serial,
      `${actionLabel} máy ${currentProduct.brand} ${currentProduct.name} (Serial: ${currentProduct.serial}) bởi ${mReleaseStaff}.`
    );

    showToast(`Đã giải phóng máy ${currentProduct.name} về trạng thái Còn hàng!`);
  };

  const handleViewProductFromLog = (log) => {
    const found = products.find(p =>
      (log.serial && p.serial === log.serial) ||
      (log.productName && `${p.brand} ${p.name}` === log.productName)
    );
    if (!found) {
      showToast('Sản phẩm này không còn trong hệ thống (đã bị xóa).', 'error');
      return;
    }
    setCurrentBrand(found.brand);
    setCurrentProduct(found);
    setCurrentTab('check-gia');
    setExpandedLogId(null);
  };

  // ── Edit product handlers ──
  const setDraftField = (field, value) =>
    setEditDraft(prev => ({ ...prev, [field]: value }));

  const handleEnterEdit = () => {
    setEditDraft({ ...currentProduct });
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditDraft(null);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const updated = {
      ...editDraft,
      price: parseInt(editDraft.price, 10),
      condition: parseInt(editDraft.condition, 10),
    };
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    setCurrentProduct(updated);
    addLog(
      LOG_TYPE.SYSTEM,
      updated.staff,
      updated.location,
      `${updated.brand} ${updated.name}`,
      updated.serial,
      `Cập nhật thông tin sản phẩm ${updated.brand} ${updated.name} (Serial: ${updated.serial}) bởi ${updated.staff}.`
    );
    showToast(`Đã cập nhật thông tin máy ${updated.name} thành công!`);
    setEditMode(false);
    setEditDraft(null);
  };

  const handleDeleteProduct = () => {
    if (currentProduct.status === PRODUCT_STATUS.DEPOSITED) {
      showToast('Không thể xoá máy đang giữ cọc! Hủy cọc trước.', 'error');
      setDeleteModalOpen(false);
      return;
    }
    if (currentProduct.status === PRODUCT_STATUS.SOLD) {
      showToast('Không thể xoá máy đã bán — dữ liệu doanh thu sẽ mất!', 'error');
      setDeleteModalOpen(false);
      return;
    }
    const { brand, name, serial, location } = currentProduct;
    setProducts(prev => prev.filter(p => p.id !== currentProduct.id));
    addLog(
      LOG_TYPE.SYSTEM,
      'Hệ thống',
      location,
      `${brand} ${name}`,
      serial,
      `Đã xoá sản phẩm ${brand} ${name} (Serial: ${serial}) khỏi hệ thống.`
    );
    showToast(`Đã xoá máy ${name} khỏi hệ thống!`);
    setDeleteModalOpen(false);
    setCurrentProduct(null);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (isUploading) return;
    const parsedPrice = parseInt(fPrice, 10);
    if (!parsedPrice || parsedPrice <= 0) {
      showToast('Giá bán phải là số dương hợp lệ!', 'error');
      return;
    }
    const duplicateSerial = products.find(p => p.serial && p.serial.trim() === fSerial.trim() && fSerial.trim() !== '');
    if (duplicateSerial) {
      showToast(`Serial "${fSerial}" đã tồn tại! (${duplicateSerial.brand} ${duplicateSerial.name})`, 'error');
      setIsUploading(false);
      return;
    }
    setIsUploading(true);
    const newId = 'sku_' + Date.now();
    const newProduct = {
      id: newId,
      brand: fBrand,
      name: fName,
      specs: `${fColorName.trim() || 'Black'}, ${fLensName ? `Kit (${fLensName})` : 'Body'}, ${fBox ? 'Fullbox' : 'No box'} / ${newId}`,
      price: parsedPrice,
      status: PRODUCT_STATUS.IN_STOCK,
      color: fColor,
      box: fBox,
      lens: fLensName !== '',
      lensName: fLensName,
      serial: fSerial,
      shotCount: fShot,
      accessories: fAccessories,
      location: fLocation,
      staff: fStaff,
      condition: parseInt(fCondition, 10),
      description: fDesc,
      dateAdded: new Date().toISOString()
    };

    if (fImages.length > 0) {
      const compressed = await Promise.all(fImages.map(img => compressImageFile(img.file)));
      const updatedImages = { ...productImages, [newId]: compressed };
      setProductImages(updatedImages);
      fImages.forEach(img => URL.revokeObjectURL(img.preview));
      setFImages([]);
    }

    setProducts(prev => [...prev, newProduct]);
    addLog(
      LOG_TYPE.IMPORT,
      fStaff,
      fLocation,
      `${fBrand} ${fName}`,
      fSerial,
      `Nhập kho thành công máy cũ ${fBrand} ${fName} ngoại hình ${fCondition}% bởi ${fStaff}.`
    );

    showToast(`Đã nhập kho thành công máy ${fBrand} ${fName}!`);

    setFName('');
    setFPrice('');
    setFSerial('');
    setFShot('');
    setFAccessories('');
    setFDesc('');
    setFBox(false);
    setFLensName('');
    setFColor('#000000');
    setFColorName('Black');

    setIsUploading(false);
    setCurrentBrand(fBrand);
    setCurrentProduct(null);
    setCurrentTab('check-gia');
  };

  const handleExportStats = async () => {
    const XLSX = await import('xlsx');
    const today = new Date();
    const dateStr = today.toLocaleDateString('vi-VN');
    const fileName = `BaoCaoDoanhSo_${today.toISOString().slice(0, 10)}.xlsx`;

    const wb = XLSX.utils.book_new();

    /* Sheet 1 — Tổng quan */
    const ws1 = XLSX.utils.aoa_to_sheet([
      ['BÁO CÁO DOANH SỐ — NIPPON CAMERA'],
      ['Ngày xuất:', dateStr],
      [],
      ['CHỈ SỐ', 'GIÁ TRỊ'],
      ['Tổng doanh thu đã bán (VND)', stats.totalRevenue],
      ['Số sản phẩm đã bán', stats.soldCount],
      ['Số sản phẩm đang giữ cọc', stats.depositedCount],
      ['Số sản phẩm tồn kho', stats.inStockCount],
      ['Tổng sản phẩm trong hệ thống', stats.totalCount],
    ]);
    XLSX.utils.book_append_sheet(wb, ws1, 'Tổng quan');

    /* Sheet 2 — Theo chi nhánh */
    const ws2 = XLSX.utils.aoa_to_sheet([
      ['CHI NHÁNH', 'DOANH THU (VND)', 'SỐ MÁY ĐÃ BÁN'],
      ...stats.byLocation.map(({ key, rev, count }) => [key, rev, count]),
    ]);
    XLSX.utils.book_append_sheet(wb, ws2, 'Theo chi nhánh');

    /* Sheet 3 — Theo nhân viên */
    const ws3 = XLSX.utils.aoa_to_sheet([
      ['NHÂN VIÊN', 'DOANH THU (VND)', 'SỐ MÁY ĐÃ BÁN'],
      ...stats.byStaff.map(({ key, rev, count }) => [key, rev, count]),
    ]);
    XLSX.utils.book_append_sheet(wb, ws3, 'Theo nhân viên');

    /* Sheet 4 — Theo thương hiệu */
    const ws4 = XLSX.utils.aoa_to_sheet([
      ['THƯƠNG HIỆU', 'DOANH THU (VND)', 'SỐ MÁY ĐÃ BÁN'],
      ...stats.byBrand.map(({ key, rev, count }) => [key, rev, count]),
    ]);
    XLSX.utils.book_append_sheet(wb, ws4, 'Theo thương hiệu');

    /* Sheet 5 — Chi tiết sản phẩm đã bán */
    const ws5 = XLSX.utils.aoa_to_sheet([
      ['STT', 'THƯƠNG HIỆU', 'TÊN MÁY', 'SERIAL', 'GIÁ NIÊM YẾT (VND)', 'GIÁ BÁN THỰC TẾ (VND)', 'KHÁCH MUA', 'SĐT KHÁCH', 'NHÂN VIÊN BÁN', 'CHI NHÁNH BÁN', 'NGÀY BÁN'],
      ...[...stats.allSold]
        .sort((a, b) => new Date(b.sellInfo?.date || 0) - new Date(a.sellInfo?.date || 0))
        .map((p, i) => [
          i + 1,
          p.brand,
          p.name,
          p.serial,
          p.price,
          p.sellInfo?.actualPrice || p.price,
          p.sellInfo?.customerName || '',
          p.sellInfo?.customerPhone || '',
          p.sellInfo?.staff    || p.staff,
          p.sellInfo?.location || p.location,
          p.sellInfo?.date
            ? new Date(p.sellInfo.date).toLocaleDateString('vi-VN')
            : '',
        ]),
    ]);
    XLSX.utils.book_append_sheet(wb, ws5, 'Chi tiết đã bán');

    XLSX.writeFile(wb, fileName);
    showToast(`Đã xuất báo cáo: ${fileName}`);
  };

  const handlePrintStats = () => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('vi-VN', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
    const fn = (n) => n.toLocaleString('vi-VN');
    const frev = (n) => {
      if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} tỷ đ`;
      if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(1)} triệu đ`;
      return fn(n) + ' đ';
    };

    const locRows = stats.byLocation.map(({ key, rev, count }) =>
      `<tr><td>${key}</td><td class="num">${fn(rev)}</td><td class="num">${count}</td></tr>`
    ).join('');

    const staffRows = stats.byStaff.map(({ key, rev, count }) =>
      `<tr><td>${key}</td><td class="num">${fn(rev)}</td><td class="num">${count}</td></tr>`
    ).join('');

    const brandRows = stats.byBrand.map(({ key, rev, count }) =>
      `<tr><td>${key}</td><td class="num">${fn(rev)}</td><td class="num">${count}</td></tr>`
    ).join('');

    const detailRows = [...stats.allSold]
      .sort((a, b) => new Date(b.sellInfo?.date || 0) - new Date(a.sellInfo?.date || 0))
      .map((p, i) => {
        const sellDate = p.sellInfo?.date
          ? new Date(p.sellInfo.date).toLocaleDateString('vi-VN')
          : '—';
        const actualPrice = p.sellInfo?.actualPrice || p.price;
        return `<tr>
          <td class="num">${i + 1}</td>
          <td>${p.brand}</td>
          <td>${p.name}</td>
          <td>${p.serial}</td>
          <td class="num">${fn(p.price)}</td>
          <td class="num">${fn(actualPrice)}</td>
          <td>${p.sellInfo?.customerName || '—'}</td>
          <td>${p.sellInfo?.staff || p.staff}</td>
          <td>${p.sellInfo?.location || p.location}</td>
          <td>${sellDate}</td>
        </tr>`;
      }).join('');

    const noSoldMsg = stats.allSold.length === 0
      ? '<tr><td colspan="10" style="text-align:center;color:#999;padding:16px">Chưa có sản phẩm nào được bán.</td></tr>'
      : detailRows;

    const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>Báo cáo doanh số — Nippon Camera</title>
  <style>
    @page { size: A4 portrait; margin: 15mm 18mm; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 11px; color: #222; background: #fff; }

    /* ── Header ── */
    .rpt-header { text-align: center; margin-bottom: 22px; padding-bottom: 14px; border-bottom: 3px solid #c7282a; }
    .rpt-store { font-size: 26px; font-weight: 900; letter-spacing: 3px; color: #c7282a; }
    .rpt-title { font-size: 15px; font-weight: 700; margin: 6px 0 3px; text-transform: uppercase; letter-spacing: 1px; }
    .rpt-date  { font-size: 11px; color: #666; }

    /* ── KPI row ── */
    .kpi-row { display: flex; gap: 10px; margin-bottom: 20px; }
    .kpi-box { flex: 1; border: 1px solid #e0e0e0; border-radius: 8px; padding: 10px 12px; text-align: center; }
    .kpi-lbl { font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; color: #888; }
    .kpi-val { font-size: 20px; font-weight: 900; margin: 4px 0 2px; color: #231f20; }
    .kpi-sub { font-size: 10px; color: #aaa; }
    .kpi-box.revenue .kpi-val { color: #c7282a; font-size: 17px; }

    /* ── Sections ── */
    .section { margin-bottom: 18px; page-break-inside: avoid; }
    .section-title {
      font-size: 10px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 1px; color: #c7282a;
      margin-bottom: 7px; padding-bottom: 4px;
      border-bottom: 1px solid #e0e0e0;
    }
    .two-col { display: flex; gap: 18px; margin-bottom: 18px; }
    .two-col .section { flex: 1; margin-bottom: 0; }

    /* ── Tables ── */
    table { width: 100%; border-collapse: collapse; }
    th {
      background: #f5f5f5; text-align: left; padding: 6px 8px;
      font-size: 9px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.4px; border-bottom: 1px solid #ccc;
    }
    td { padding: 5px 8px; border-bottom: 1px solid #f0f0f0; font-size: 10.5px; }
    tr:last-child td { border-bottom: none; }
    .num { text-align: right; font-variant-numeric: tabular-nums; }

    /* ── Footer ── */
    .rpt-footer {
      margin-top: 24px; padding-top: 10px;
      border-top: 1px solid #e0e0e0;
      text-align: center; font-size: 9.5px; color: #aaa;
    }

    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="rpt-header">
    <div class="rpt-store">NIPPON CAMERA</div>
    <div class="rpt-title">Báo cáo doanh số</div>
    <div class="rpt-date">${dateStr}</div>
  </div>

  <div class="kpi-row">
    <div class="kpi-box revenue">
      <div class="kpi-lbl">Doanh thu đã bán</div>
      <div class="kpi-val">${frev(stats.totalRevenue)}</div>
      <div class="kpi-sub">${stats.soldCount} sản phẩm</div>
    </div>
    <div class="kpi-box">
      <div class="kpi-lbl">Đã bán</div>
      <div class="kpi-val">${stats.soldCount}</div>
      <div class="kpi-sub">sản phẩm</div>
    </div>
    <div class="kpi-box">
      <div class="kpi-lbl">Đang giữ cọc</div>
      <div class="kpi-val">${stats.depositedCount}</div>
      <div class="kpi-sub">sản phẩm</div>
    </div>
    <div class="kpi-box">
      <div class="kpi-lbl">Tồn kho</div>
      <div class="kpi-val">${stats.inStockCount}</div>
      <div class="kpi-sub">/ ${stats.totalCount} tổng</div>
    </div>
  </div>

  <div class="two-col">
    <div class="section">
      <div class="section-title">Doanh thu theo chi nhánh</div>
      <table>
        <thead><tr><th>Chi nhánh</th><th class="num">Doanh thu (đ)</th><th class="num">Máy</th></tr></thead>
        <tbody>${locRows || '<tr><td colspan="3" style="color:#aaa;text-align:center">Chưa có dữ liệu</td></tr>'}</tbody>
      </table>
    </div>
    <div class="section">
      <div class="section-title">Doanh thu theo nhân viên</div>
      <table>
        <thead><tr><th>Nhân viên</th><th class="num">Doanh thu (đ)</th><th class="num">Máy</th></tr></thead>
        <tbody>${staffRows || '<tr><td colspan="3" style="color:#aaa;text-align:center">Chưa có dữ liệu</td></tr>'}</tbody>
      </table>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Doanh thu theo thương hiệu</div>
    <table>
      <thead><tr><th>Thương hiệu</th><th class="num">Doanh thu (đ)</th><th class="num">Máy đã bán</th></tr></thead>
      <tbody>${brandRows || '<tr><td colspan="3" style="color:#aaa;text-align:center">Chưa có dữ liệu</td></tr>'}</tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">Chi tiết sản phẩm đã bán</div>
    <table>
      <thead>
        <tr>
          <th class="num">#</th>
          <th>Hãng</th>
          <th>Tên máy</th>
          <th>Serial</th>
          <th class="num">Giá niêm yết (đ)</th>
          <th class="num">Giá bán thực (đ)</th>
          <th>Khách mua</th>
          <th>Nhân viên</th>
          <th>Chi nhánh</th>
          <th>Ngày bán</th>
        </tr>
      </thead>
      <tbody>${noSoldMsg}</tbody>
    </table>
  </div>

  <div class="rpt-footer">
    Báo cáo được tạo tự động từ hệ thống Nippon Camera &nbsp;|&nbsp; ${dateStr}
  </div>

  <script>
    window.onload = function () {
      window.print();
      window.onafterprint = function () { window.close(); };
    };
  </script>
</body>
</html>`;

    const w = window.open('', '_blank', 'width=900,height=700');
    w.document.write(html);
    w.document.close();
  };

  const handleExportDB = () => {
    triggerJsonDownload(
      { products, history, images: productImages },
      `nippon_camera_db_${new Date().toISOString().slice(0, 10)}.json`
    );
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
          if (db.images && typeof db.images === 'object') {
            setProductImages(db.images);
          }
          setCurrentProduct(null);
          setCurrentBrand(null);
          setCurrentTab('check-gia');
          showToast('Đã nhập cơ sở dữ liệu thành công!', 'success');
        } else {
          showToast('Định dạng file sao lưu không hợp lệ!', 'error');
        }
      } catch {
        showToast('Lỗi khi đọc file sao lưu!', 'error');
      }
    };
    reader.readAsText(file);
  };

  // ════════════════════════════════════════════════════
  // 3. SELECTION & FILTER LOGIC
  // ════════════════════════════════════════════════════

  const filteredHistory = useMemo(() => {
    let result = history;
    if (historyTypeFilter) {
      result = result.filter(log => log.type === historyTypeFilter);
    }
    if (historyQuery.trim()) {
      const q = historyQuery.toLowerCase().trim();
      result = result.filter(log =>
        log.productName?.toLowerCase().includes(q) ||
        log.staff?.toLowerCase().includes(q) ||
        log.location?.toLowerCase().includes(q) ||
        log.serial?.toLowerCase().includes(q) ||
        log.details?.toLowerCase().includes(q)
      );
    }
    if (historyFromDate) {
      result = result.filter(log => log.date >= historyFromDate);
    }
    if (historyToDate) {
      result = result.filter(log => log.date <= historyToDate + 'T23:59:59');
    }
    return result;
  }, [history, historyQuery, historyTypeFilter, historyFromDate, historyToDate]);

  const stats = useMemo(() => {
    const now = Date.now();
    const cutoff = statsPeriod === 'all' ? null
      : statsPeriod === '1m' ? new Date(now - 30  * 24 * 60 * 60 * 1000)
      : statsPeriod === '3m' ? new Date(now - 90  * 24 * 60 * 60 * 1000)
      : new Date(now - 180 * 24 * 60 * 60 * 1000);

    const allSold = products.filter(p => p.status === PRODUCT_STATUS.SOLD);
    const sold    = allSold.filter(p =>
      !cutoff || (p.sellInfo?.date && new Date(p.sellInfo.date) >= cutoff)
    );
    const deposited = products.filter(p => p.status === PRODUCT_STATUS.DEPOSITED);
    const inStock   = products.filter(p => p.status === PRODUCT_STATUS.IN_STOCK);

    const salePrice = (p) => p.sellInfo?.actualPrice || p.price;
    const totalRevenue = sold.reduce((sum, p) => sum + salePrice(p), 0);

    const groupBy = (arr, keyFn, valFn = salePrice) => {
      const map = {};
      arr.forEach(p => {
        const k = keyFn(p);
        if (!map[k]) map[k] = { rev: 0, count: 0 };
        map[k].rev   += valFn(p);
        map[k].count += 1;
      });
      return Object.entries(map)
        .map(([key, v]) => ({ key, ...v }))
        .sort((a, b) => b.rev - a.rev);
    };

    const filteredHistory = cutoff
      ? history.filter(l => new Date(l.date) >= cutoff)
      : history;

    return {
      totalRevenue,
      soldCount:      sold.length,
      depositedCount: deposited.length,
      inStockCount:   inStock.length,
      totalCount:     products.length,
      byLocation: groupBy(sold, p => p.sellInfo?.location || p.location),
      byStaff:    groupBy(sold, p => p.sellInfo?.staff    || p.staff),
      byBrand:    groupBy(sold, p => p.brand),
      allSold:     sold,
      topProducts: [...sold].sort((a, b) => b.price - a.price).slice(0, 5),
      logCounts:  Object.fromEntries(
        Object.values(LOG_TYPE).map(t => [t, filteredHistory.filter(l => l.type === t).length])
      ),
    };
  }, [products, history, statsPeriod]);

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    if (tab !== 'check-gia') {
      setCurrentBrand(null);
      setCurrentProduct(null);
      setSearchQuery('');
      setPriceFilter('');
    }
    if (tab !== 'lich-su') {
      setHistoryQuery('');
      setHistoryTypeFilter('');
    }
  };

  const handleBrandSelect = (brand) => {
    setCurrentBrand(brand);
    setCurrentPage(1);
    setPriceFilter('');
    setStatusFilter('');
    setCurrentProduct(null);
  };

  // FIX #4: useMemo — filter + pagination only recomputes when relevant state changes
  // Brand + search + price filtered (everything except status) — basis for counts
  const brandScopedProducts = useMemo(() => {
    let result = products;

    if (currentBrand) {
      result = result.filter(p => p.brand === currentBrand);
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.specs.toLowerCase().includes(q) ||
        p.serial?.toLowerCase().includes(q)
      );
    }
    if (priceFilter === 'duoi-15') {
      result = result.filter(p => p.price < 15000000);
    } else if (priceFilter === '15-30') {
      result = result.filter(p => p.price >= 15000000 && p.price <= 30000000);
    } else if (priceFilter === 'tren-30') {
      result = result.filter(p => p.price > 30000000);
    }

    return result;
  }, [products, currentBrand, searchQuery, priceFilter]);

  // Group products by model name. Each used camera stays its own record
  // (unique serial / condition / price), but the list rolls them up so staff
  // see "X-M5 — 3 máy: 2 còn hàng · 1 đã cọc". Single-unit models stay flat.
  const groupedProducts = useMemo(() => {
    const map = new Map();
    brandScopedProducts.forEach(p => {
      if (!map.has(p.name)) map.set(p.name, []);
      map.get(p.name).push(p);
    });
    const groups = [];
    map.forEach((items, name) => {
      const counts = {
        [PRODUCT_STATUS.IN_STOCK]:  items.filter(p => p.status === PRODUCT_STATUS.IN_STOCK).length,
        [PRODUCT_STATUS.DEPOSITED]: items.filter(p => p.status === PRODUCT_STATUS.DEPOSITED).length,
        [PRODUCT_STATUS.SOLD]:      items.filter(p => p.status === PRODUCT_STATUS.SOLD).length,
      };
      // status filter narrows which units show, but the header keeps full counts
      const visibleItems = statusFilter ? items.filter(p => p.status === statusFilter) : items;
      if (visibleItems.length === 0) return;
      groups.push({ name, items: visibleItems, counts, total: items.length });
    });
    return groups;
  }, [brandScopedProducts, statusFilter]);

  // Counts per status for the current brand scope (drives the filter pills)
  const statusCounts = useMemo(() => {
    const counts = {
      all: brandScopedProducts.length,
      [PRODUCT_STATUS.IN_STOCK]: 0,
      [PRODUCT_STATUS.DEPOSITED]: 0,
      [PRODUCT_STATUS.SOLD]: 0,
    };
    let depositTotal = 0;
    brandScopedProducts.forEach(p => {
      counts[p.status] = (counts[p.status] || 0) + 1;
      if (p.status === PRODUCT_STATUS.DEPOSITED) {
        depositTotal += p.depositInfo?.amount || 0;
      }
    });
    return { ...counts, depositTotal };
  }, [brandScopedProducts]);

  // Global search across all brands (used when on brand grid with a search query)
  const globalSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.specs.toLowerCase().includes(q) ||
      p.serial?.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  const itemsPerPage = 6;

  // Paginate by group (model), not by individual unit
  const { totalPages, pagedGroups } = useMemo(() => {
    const total = Math.ceil(groupedProducts.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    return {
      totalPages: total,
      pagedGroups: groupedProducts.slice(start, start + itemsPerPage),
    };
  }, [groupedProducts, currentPage]);

  const toggleGroupCollapse = (name) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  };

  // Single product card — shared by flat single-unit models and grouped units
  const renderProductCard = (p) => {
    const { text: statusText, cls: statusClass } = STATUS_DISPLAY[p.status] ?? STATUS_DISPLAY[PRODUCT_STATUS.IN_STOCK];
    return (
      <div
        key={p.id}
        className="productCard"
        onClick={() => { setCurrentProduct(p); setActiveThumbIndex(0); }}
      >
        <div className="productCardImage">
          {getProductPhoto(p.id) && !failedImages.has(p.id)
            ? <img
                src={getProductPhoto(p.id)}
                alt={p.name}
                className="productCardImg"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={() => setFailedImages(prev => new Set([...prev, p.id]))}
              />
            : <svg className="placeholder-img-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
          }
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
  };

  // Render grouped list: consecutive single-unit models batch into one grid
  // (preserves the 2-col look); multi-unit models get a full-width group block.
  const renderGroupedList = () => {
    const blocks = [];
    let singleBatch = [];
    const flushSingles = () => {
      if (singleBatch.length) {
        blocks.push(
          <div className="productGrid" key={`singles-${blocks.length}`}>
            {singleBatch.map(renderProductCard)}
          </div>
        );
        singleBatch = [];
      }
    };
    pagedGroups.forEach(g => {
      if (g.total === 1) {
        singleBatch.push(g.items[0]);
        return;
      }
      flushSingles();
      const collapsed = collapsedGroups.has(g.name);
      blocks.push(
        <div className="modelGroup" key={g.name}>
          <div className="modelGroupHeader" onClick={() => toggleGroupCollapse(g.name)}>
            <div className="modelGroupTitleWrap">
              <h3 className="modelGroupTitle">{g.name}</h3>
              <span className="modelGroupTotal">{g.total} máy</span>
            </div>
            <div className="modelGroupBreakdown">
              {g.counts[PRODUCT_STATUS.IN_STOCK] > 0 && (
                <span className="mgb mgb-con">{g.counts[PRODUCT_STATUS.IN_STOCK]} còn hàng</span>
              )}
              {g.counts[PRODUCT_STATUS.DEPOSITED] > 0 && (
                <span className="mgb mgb-coc">{g.counts[PRODUCT_STATUS.DEPOSITED]} đã cọc</span>
              )}
              {g.counts[PRODUCT_STATUS.SOLD] > 0 && (
                <span className="mgb mgb-ban">{g.counts[PRODUCT_STATUS.SOLD]} đã bán</span>
              )}
              <span className="modelGroupToggle">{collapsed ? '▼' : '▲'}</span>
            </div>
          </div>
          {!collapsed && (
            <div className="productGrid modelGroupGrid">
              {g.items.map(renderProductCard)}
            </div>
          )}
        </div>
      );
    });
    flushSingles();
    return blocks;
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
        <button
          className={`bottomNavBtn ${currentTab === 'thong-ke' ? 'active' : ''}`}
          data-tab="thong-ke"
          onClick={() => handleTabChange('thong-ke')}
        >
          THỐNG KÊ
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

          {/* 1. BRAND GRID VIEW (or global search results) */}
          {!currentBrand && !currentProduct && (
            searchQuery.trim() !== '' ? (
              <div id="global-search-results">
                <h2 className="globalSearchHeading">KẾT QUẢ TÌM KIẾM</h2>
                {globalSearchResults.length === 0 ? (
                  <div className="noProducts">
                    <p>Không tìm thấy sản phẩm nào phù hợp.</p>
                  </div>
                ) : (
                  <>
                    <p className="globalSearchCount">{globalSearchResults.length} sản phẩm tìm thấy</p>
                    <div className="productGrid">
                      {globalSearchResults.map(p => {
                        const { text: statusText, cls: statusClass } = STATUS_DISPLAY[p.status] ?? STATUS_DISPLAY[PRODUCT_STATUS.IN_STOCK];
                        return (
                          <div
                            key={p.id}
                            className="productCard"
                            onClick={() => {
                              setCurrentBrand(p.brand);
                              setCurrentProduct(p);
                              setActiveThumbIndex(0);
                            }}
                          >
                            <div className="productCardImage">
                              {getProductPhoto(p.id) && !failedImages.has(p.id)
                                ? <img
                                    src={getProductPhoto(p.id)}
                                    alt={p.name}
                                    className="productCardImg"
                                    loading="lazy"
                                    referrerPolicy="no-referrer"
                                    onError={() => setFailedImages(prev => new Set([...prev, p.id]))}
                                  />
                                : <svg className="placeholder-img-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                    <circle cx="8.5" cy="8.5" r="1.5"/>
                                    <polyline points="21 15 16 10 5 21"/>
                                  </svg>
                              }
                            </div>
                            <div className="productCardInfo">
                              <div className={`productCardStatus ${statusClass}`}>{statusText}</div>
                              <h3 className="productCardTitle">{p.name}</h3>
                              <p className="productCardSpecs">{p.specs.split(' / ')[0]}</p>
                              <p className="productCardId">SKU: {p.id} · {p.brand}</p>
                              <div className="productCardPrice">{formatMoneyRaw(p.price)}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            ) : (
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
            )
          )}

          {/* 2. SUB-BRAND PRODUCT LIST VIEW */}
          {currentBrand && !currentProduct && (
            <div id="brand-list">
              <button
                className="viewBackBtn"
                onClick={() => { setCurrentBrand(null); setCurrentPage(1); }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Tất cả thương hiệu
              </button>

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

              {/* Status filter pills with live counts */}
              <div className="statusFilterBar">
                {[
                  { value: '',                          label: 'Tất cả',   count: statusCounts.all },
                  { value: PRODUCT_STATUS.IN_STOCK,     label: 'Còn hàng', count: statusCounts[PRODUCT_STATUS.IN_STOCK] },
                  { value: PRODUCT_STATUS.DEPOSITED,    label: 'Đã cọc',   count: statusCounts[PRODUCT_STATUS.DEPOSITED] },
                  { value: PRODUCT_STATUS.SOLD,         label: 'Đã bán',   count: statusCounts[PRODUCT_STATUS.SOLD] },
                ].map(({ value, label, count }) => (
                  <button
                    key={value}
                    className={`statusFilterBtn ${statusFilter === value ? 'active' : ''} ${value ? STATUS_DISPLAY[value]?.cls : ''}`}
                    onClick={() => { setStatusFilter(value); setCurrentPage(1); }}
                  >
                    {label} <span className="statusFilterCount">{count}</span>
                  </button>
                ))}
              </div>

              {/* Inventory summary: how much stock left, how much deposited */}
              <div className="inventorySummary">
                <span className="inventorySummaryItem">
                  Còn <strong>{statusCounts[PRODUCT_STATUS.IN_STOCK]}</strong> máy có thể bán
                </span>
                {statusCounts[PRODUCT_STATUS.DEPOSITED] > 0 && (
                  <>
                    <span className="inventorySummaryDot">•</span>
                    <span className="inventorySummaryItem">
                      <strong>{statusCounts[PRODUCT_STATUS.DEPOSITED]}</strong> máy khách đang giữ cọc
                      {statusCounts.depositTotal > 0 && (
                        <> (tổng cọc <strong>{formatMoney(statusCounts.depositTotal)}</strong>)</>
                      )}
                    </span>
                  </>
                )}
              </div>

              {groupedProducts.length === 0 ? (
                <div className="noProducts">
                  <p>Không tìm thấy sản phẩm cũ nào phù hợp.</p>
                </div>
              ) : (
                <div className="productListGrouped">
                  {renderGroupedList()}
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
          {currentProduct && !editMode && (
            <div id="product-detail">
              <button
                className="viewBackBtn"
                onClick={() => setCurrentProduct(null)}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                {currentProduct.brand}
              </button>

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

                  {currentProduct.status === PRODUCT_STATUS.SOLD && currentProduct.sellInfo && (
                    <div className="depositInfoBlock sellInfoBlock">
                      <div className="depositInfoTitle">Thông tin bán hàng</div>
                      <div className="depositInfoRow">
                        <span className="depositInfoLabel">Khách mua:</span>
                        <span className="depositInfoValue">
                          {currentProduct.sellInfo.customerName || '—'}{currentProduct.sellInfo.customerPhone ? ` — ${currentProduct.sellInfo.customerPhone}` : ''}
                        </span>
                      </div>
                      <div className="depositInfoRow">
                        <span className="depositInfoLabel">Giá bán thực:</span>
                        <span className="depositInfoValue" style={{color: '#c7282a', fontWeight: 700}}>
                          {currentProduct.sellInfo.actualPrice ? formatMoney(currentProduct.sellInfo.actualPrice) : formatMoney(currentProduct.price)}
                          {currentProduct.sellInfo.actualPrice && currentProduct.sellInfo.actualPrice < currentProduct.price && (
                            <span style={{color:'#888', fontWeight:400, fontSize:'12px', marginLeft:'6px'}}>
                              (giảm {formatMoney(currentProduct.price - currentProduct.sellInfo.actualPrice)})
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="depositInfoRow">
                        <span className="depositInfoLabel">Ngày bán:</span>
                        <span className="depositInfoValue">{formatDate(currentProduct.sellInfo.date)}</span>
                      </div>
                      <div className="depositInfoRow">
                        <span className="depositInfoLabel">NV / Chi nhánh:</span>
                        <span className="depositInfoValue">
                          {currentProduct.sellInfo.staff} / {currentProduct.sellInfo.location}
                        </span>
                      </div>
                    </div>
                  )}

                  {currentProduct.status === PRODUCT_STATUS.DEPOSITED && currentProduct.depositInfo && (
                    <div className="depositInfoBlock">
                      <div className="depositInfoTitle">Thông tin cọc</div>
                      <div className="depositInfoRow">
                        <span className="depositInfoLabel">Khách:</span>
                        <span className="depositInfoValue">
                          {currentProduct.depositInfo.customerName || '—'} — {currentProduct.depositInfo.customerPhone || '—'}
                        </span>
                      </div>
                      <div className="depositInfoRow">
                        <span className="depositInfoLabel">Tiền cọc:</span>
                        <span className="depositInfoValue">
                          {currentProduct.depositInfo.amount ? formatMoney(currentProduct.depositInfo.amount) : '—'}
                        </span>
                      </div>
                      <div className="depositInfoRow">
                        <span className="depositInfoLabel">Ngày cọc:</span>
                        <span className="depositInfoValue">{formatDate(currentProduct.depositInfo.date)}</span>
                      </div>
                      <div className="depositInfoRow">
                        <span className="depositInfoLabel">NV / Chi nhánh:</span>
                        <span className="depositInfoValue">
                          {currentProduct.depositInfo.staff} / {currentProduct.depositInfo.location}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Gallery */}
                <div className="detailGallery">
                  <div className="thumbColumn">
                    {[0, 1, 2].map(idx => {
                      const photos = getProductPhotoList(currentProduct.id);
                      const src = photos[idx];
                      return (
                        <div
                          key={idx}
                          className={`thumbItem ${idx === activeThumbIndex ? 'active' : ''}`}
                          onClick={() => src && setActiveThumbIndex(idx)}
                        >
                          {src && !failedImages.has(`${currentProduct.id}_${idx}`)
                            ? <img
                                src={src}
                                alt=""
                                referrerPolicy="no-referrer"
                                onError={() => setFailedImages(prev => new Set([...prev, `${currentProduct.id}_${idx}`]))}
                              />
                            : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <polyline points="21 15 16 10 5 21"/>
                              </svg>
                          }
                        </div>
                      );
                    })}
                  </div>

                  <div className="mainImageWrapper">
                    <div className={`mainImageBadge ${STATUS_DISPLAY[currentProduct.status]?.cls}`}>
                      {STATUS_DISPLAY[currentProduct.status]?.text}
                    </div>
                    <div className="mainImageContainer">
                      {(() => {
                        const photos = getProductPhotoList(currentProduct.id);
                        const src = photos[activeThumbIndex];
                        return src && !failedImages.has(`${currentProduct.id}_${activeThumbIndex}`)
                          ? <img
                              src={src}
                              alt={`${currentProduct.brand} ${currentProduct.name}`}
                              className="mainImage mainImageClickable"
                              referrerPolicy="no-referrer"
                              onClick={() => setPreviewImage({ photos, index: activeThumbIndex })}
                              onError={() => setFailedImages(prev => new Set([...prev, `${currentProduct.id}_${activeThumbIndex}`]))}
                            />
                          : <svg className="placeholder-img-icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                              <circle cx="8.5" cy="8.5" r="1.5"/>
                              <polyline points="21 15 16 10 5 21"/>
                            </svg>;
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action and Download Row */}
              <div className="galleryActions">
                <button
                  className="downloadBtn"
                  onClick={async () => {
                    const photos = getProductPhotoList(currentProduct.id);
                    const src = photos[activeThumbIndex];
                    if (!src) { showToast('Không có ảnh để tải xuống!', 'error'); return; }
                    try {
                      let blob;
                      if (src.startsWith('data:')) {
                        const res = await fetch(src);
                        blob = await res.blob();
                      } else {
                        const res = await fetch(src);
                        blob = await res.blob();
                      }
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${currentProduct.brand}_${currentProduct.name}_${activeThumbIndex + 1}.jpg`;
                      a.click();
                      URL.revokeObjectURL(url);
                      showToast('Đã tải xuống ảnh thành công!');
                    } catch {
                      showToast('Không thể tải ảnh này (ảnh ngoài có thể bị chặn CORS)!', 'error');
                    }
                  }}
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
                  {currentProduct.status === PRODUCT_STATUS.IN_STOCK ? (
                    <>
                      <button className="actionBtn btnBan" onClick={() => setSellModalOpen(true)}>
                        BÁN NGAY
                      </button>
                      <button className="actionBtn btnCoc" onClick={() => setDepositModalOpen(true)}>
                        NHẬN CỌC
                      </button>
                    </>
                  ) : currentProduct.status === PRODUCT_STATUS.DEPOSITED ? (
                    <>
                      <button className="actionBtn btnBan" onClick={() => setSellModalOpen(true)}>
                        BÁN NGAY
                      </button>
                      <button className="actionBtn btnRelease" onClick={() => setReleaseConfirmOpen(true)}>
                        HỦY CỌC (CÒN HÀNG)
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="statusNotice">Sản phẩm này đã được bán thành công.</p>
                      <button className="actionBtn btnRelease" onClick={() => setReleaseConfirmOpen(true)}>
                        RESET CÒN HÀNG
                      </button>
                    </>
                  )}
                  <button className="actionBtn btnEdit" onClick={handleEnterEdit}>
                    CHỈNH SỬA THÔNG TIN
                  </button>
                  <button className="actionBtn btnDelete" onClick={() => setDeleteModalOpen(true)}>
                    XOÁ SẢN PHẨM
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* ── EDIT PRODUCT FORM ── */}
          {currentProduct && editMode && editDraft && (
            <div id="product-edit">
              <button className="viewBackBtn" onClick={handleCancelEdit}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                {currentProduct.name}
              </button>

              <div className="viewHeader" style={{ textAlign: 'left', marginBottom: '20px' }}>
                <h2 style={{ marginBottom: '4px' }}>CHỈNH SỬA THÔNG TIN</h2>
                <p className="viewSubtitle">{currentProduct.brand} {currentProduct.name} — Serial: {currentProduct.serial}</p>
              </div>

              <form onSubmit={handleSaveEdit} className="entryForm">
                <div className="formGrid">
                  <div className="formGroup">
                    <label htmlFor="e-brand">Thương hiệu *</label>
                    <select id="e-brand" value={editDraft.brand} onChange={e => setDraftField('brand', e.target.value)}>
                      {Object.keys(BRAND_SLOGANS).map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div className="formGroup">
                    <label htmlFor="e-name">Tên model *</label>
                    <input
                      type="text"
                      id="e-name"
                      value={editDraft.name}
                      onChange={e => setDraftField('name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="formGroup">
                    <label htmlFor="e-color">Màu sắc *</label>
                    <div className="colorInputWrapper">
                      <input
                        type="color"
                        id="e-color"
                        value={editDraft.color}
                        onChange={e => setDraftField('color', e.target.value)}
                      />
                      <input
                        type="text"
                        value={editDraft.color}
                        onChange={e => setDraftField('color', e.target.value)}
                        placeholder="#000000"
                      />
                    </div>
                  </div>

                  <div className="formGroup">
                    <label htmlFor="e-price">Giá bán (VNĐ) *</label>
                    <input
                      type="number"
                      id="e-price"
                      value={editDraft.price}
                      onChange={e => setDraftField('price', e.target.value)}
                      required
                    />
                  </div>

                  <div className="formGroup">
                    <label htmlFor="e-serial">Mã Serial *</label>
                    <input
                      type="text"
                      id="e-serial"
                      value={editDraft.serial}
                      onChange={e => setDraftField('serial', e.target.value)}
                      required
                    />
                  </div>

                  <div className="formGroup">
                    <label htmlFor="e-shot">Số shot chụp *</label>
                    <input
                      type="text"
                      id="e-shot"
                      value={editDraft.shotCount}
                      onChange={e => setDraftField('shotCount', e.target.value)}
                      required
                    />
                  </div>

                  <div className="formGroup">
                    <label htmlFor="e-location">Vị trí kho máy *</label>
                    <select id="e-location" value={editDraft.location} onChange={e => setDraftField('location', e.target.value)}>
                      {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>

                  <div className="formGroup">
                    <label htmlFor="e-staff">Nhân viên phụ trách *</label>
                    <select id="e-staff" value={editDraft.staff} onChange={e => setDraftField('staff', e.target.value)}>
                      {STAFFS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="formGroup">
                    <label htmlFor="e-condition">Tình trạng máy (%) *</label>
                    <input
                      type="number"
                      id="e-condition"
                      min="1"
                      max="100"
                      value={editDraft.condition}
                      onChange={e => setDraftField('condition', e.target.value)}
                      required
                    />
                  </div>

                  <div className="formGroup checkboxGroup">
                    <label>
                      <input
                        type="checkbox"
                        checked={editDraft.box}
                        onChange={e => setDraftField('box', e.target.checked)}
                      />{' '}
                      Máy kèm Hộp (Fullbox)
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={editDraft.lens}
                        onChange={e => setDraftField('lens', e.target.checked)}
                      />{' '}
                      Máy đi kèm Ống kính (Lens Kit)
                    </label>
                  </div>
                </div>

                <div className="formGroup fullWidth">
                  <label htmlFor="e-accessories">Phụ kiện kèm theo *</label>
                  <input
                    type="text"
                    id="e-accessories"
                    value={editDraft.accessories}
                    onChange={e => setDraftField('accessories', e.target.value)}
                    required
                  />
                </div>

                <div className="formGroup fullWidth">
                  <label htmlFor="e-desc">Mô tả tình trạng ngoại hình *</label>
                  <textarea
                    id="e-desc"
                    rows="3"
                    value={editDraft.description}
                    onChange={e => setDraftField('description', e.target.value)}
                    required
                  />
                </div>

                <div className="editFormActions">
                  <button type="button" className="cancelEditBtn" onClick={handleCancelEdit}>
                    HỦY
                  </button>
                  <button type="submit" className="submitBtn editSubmitBtn">
                    LƯU THAY ĐỔI
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ── SUBVIEW: NHẬP LIỆU ── */}
      {currentTab === 'nhap-lieu' && (
        <div id="nhap-lieu-view">
          {/* Header */}
          <div className="entryPageHeader">
            <h2 className="entryPageTitle">CÔNG CỤ NHẬP LIỆU HÀNG CŨ</h2>
            <div className="entryLocationPill">
              <span className="entryLocationLabel">Vị trí</span>
              <select value={fLocation} onChange={e => setFLocation(e.target.value)} className="entryLocationSelect">
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="entryBody">
            {/* ── LEFT: image upload ── */}
            <div className="entryLeft">
              {/* Brand / Danh mục */}
              <div className="entryFieldBlock">
                <span className="entryFieldLabel">Danh mục</span>
                <select className="entrySelect" value={fBrand} onChange={e => setFBrand(e.target.value)}>
                  {Object.keys(BRAND_SLOGANS).map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Drop zone */}
              <div
                className={`uploadZone${isDragging ? ' dragging' : ''}`}
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => { e.preventDefault(); setIsDragging(false); handleImageFiles(e.dataTransfer.files); }}
                onClick={() => imageInputRef.current?.click()}
              >
                <svg className="uploadZoneIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <svg className="uploadArrowIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
                <p className="uploadZoneText">Kéo thả file vào đây, hoặc bấm chọn</p>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={e => { handleImageFiles(e.target.files); e.target.value = ''; }}
                />
              </div>

              {/* File list */}
              {fImages.map((img, idx) => (
                <div key={img.id} className="uploadFileItem">
                  <div
                    className="uploadFileThumbnail"
                    onClick={() => setPreviewImage({ photos: fImages.map(i => i.preview), index: idx })}
                    title="Bấm để xem ảnh lớn"
                  >
                    <img src={img.preview} alt="" />
                  </div>
                  <div
                    className="uploadFileInfo"
                    onClick={() => setPreviewImage({ photos: fImages.map(i => i.preview), index: idx })}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="uploadFileName">{img.name}</span>
                    <span className="uploadFileSize">{Math.round(img.size / 1024)} KB</span>
                  </div>
                  <button
                    type="button"
                    className="uploadFileRemove"
                    onClick={() => handleImageRemove(idx)}
                  >✕</button>
                </div>
              ))}
            </div>

            {/* ── RIGHT: form fields ── */}
            <div className="entryRight">
              <form onSubmit={handleAddProduct} className="entryForm2">
                {/* Tên máy */}
                <input
                  className="entryInput"
                  type="text"
                  placeholder="Nhập tên máy  Vd: X-M5"
                  value={fName}
                  onChange={e => setFName(e.target.value)}
                  required
                />

                {/* Màu sắc + Serial */}
                <div className="entryInlineRow">
                  <span className="entryInlineLabel">Màu sắc</span>
                  <label className="colorCircleLabel">
                    <span className="colorCirclePreview" style={{ background: fColor }} />
                    <input
                      type="color"
                      value={fColor}
                      onChange={e => {
                        setFColor(e.target.value);
                        if (e.target.value === '#000000') setFColorName('Black');
                        else if (e.target.value === '#c0c0c0' || e.target.value === '#c0c0c1') setFColorName('Silver');
                        else if (e.target.value === '#ffffff') setFColorName('White');
                        else if (e.target.value === '#3a3a3a') setFColorName('Dark Grey');
                      }}
                      className="colorCircleInput"
                    />
                  </label>
                  <input
                    className="entryInput"
                    type="text"
                    placeholder="Tên màu (Black, Silver...)"
                    value={fColorName}
                    onChange={e => setFColorName(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <span className="entryInlineLabel">Serial</span>
                  <input
                    className="entryInput entryInputSmall"
                    type="text"
                    placeholder="Nhập Serial"
                    value={fSerial}
                    onChange={e => setFSerial(e.target.value)}
                  />
                </div>

                {/* Box */}
                <div className="entryInlineRow">
                  <span className="entryInlineLabel">Box</span>
                  <label className="entryRadioLabel">
                    <input
                      type="radio"
                      name="fBox"
                      checked={!fBox}
                      onChange={() => setFBox(false)}
                      className="entryRadio"
                    />
                    Không box
                  </label>
                  <label className="entryRadioLabel">
                    <input
                      type="radio"
                      name="fBox"
                      checked={fBox}
                      onChange={() => setFBox(true)}
                      className="entryRadio"
                    />
                    Có box
                  </label>
                </div>

                {/* Lens */}
                <div className="entryInlineRow">
                  <span className="entryInlineLabel">Lens</span>
                  <input
                    className="entryInput entryInputFlex"
                    type="text"
                    placeholder="Nhập tên lens"
                    value={fLensName}
                    onChange={e => setFLensName(e.target.value)}
                  />
                </div>

                {/* Shot + Đánh giá */}
                <div className="entryInlineRow">
                  <span className="entryInlineLabel">Shot</span>
                  <input
                    className="entryInput entryInputSmall"
                    type="text"
                    placeholder="Số shot"
                    value={fShot}
                    onChange={e => setFShot(e.target.value)}
                  />
                  <span className="entryInlineLabel">Đánh giá</span>
                  <input
                    className="entryInput entryInputTiny"
                    type="number"
                    min="1"
                    max="100"
                    value={fCondition}
                    onChange={e => setFCondition(parseInt(e.target.value, 10))}
                  />
                  <span className="entryInlineLabel">%</span>
                </div>

                {/* Phụ kiện */}
                <div className="entryInlineRow">
                  <span className="entryInlineLabel">Phụ kiện</span>
                  <input
                    className="entryInput entryInputFlex"
                    type="text"
                    placeholder="Không có thì để trống"
                    value={fAccessories}
                    onChange={e => setFAccessories(e.target.value)}
                  />
                </div>

                {/* Giá */}
                <div className="entryInlineRow">
                  <span className="entryInlineLabel">Giá bán</span>
                  <input
                    className="entryInput entryInputFlex"
                    type="number"
                    placeholder="VD: 21990000"
                    value={fPrice}
                    onChange={e => setFPrice(e.target.value)}
                    required
                  />
                </div>

                {/* Nhân viên */}
                <div className="entryInlineRow">
                  <span className="entryInlineLabel">Nhân viên</span>
                  <select className="entrySelect entryInputFlex" value={fStaff} onChange={e => setFStaff(e.target.value)}>
                    {STAFFS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Mô tả ngắn */}
                <div className="entryDescBlock">
                  <span className="entryDescLabel">Mô tả ngắn:</span>
                  <textarea
                    className="entryTextarea"
                    rows="3"
                    placeholder="Tình trạng nhìn bằng mắt thường ra sao"
                    value={fDesc}
                    onChange={e => setFDesc(e.target.value)}
                  />
                </div>

                <button type="submit" className="entrySubmitBtn" disabled={isUploading}>
                  {isUploading ? 'ĐANG XỬ LÝ...' : 'NHẬP VÀO'}
                </button>
              </form>
            </div>
          </div>

          {/* Backup Database */}
          <div className="backupRestoreSection">
            <h3>SAO LƯU & ĐỒNG BỘ DỮ LIỆU</h3>
            <p className="backupText">
              Vì hệ thống vận hành hoàn toàn phía máy khách (Client-side), bạn có thể xuất cơ sở dữ liệu làm file JSON (bao gồm hình ảnh) để gửi cho nhân viên chi nhánh khác, hoặc nhập file JSON nhận được để cập nhật bảng giá.
            </p>
            <div className="backupActions">
              <button type="button" className="backupBtn btnExport" onClick={handleExportDB}>
                XUẤT DỮ LIỆU JSON
              </button>
              <button
                type="button"
                className="backupBtn btnImport"
                onClick={() => importFileRef.current?.click()}
              >
                NHẬP DỮ LIỆU JSON
              </button>
              <input
                ref={importFileRef}
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={handleImportDB}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── IMAGE PREVIEW LIGHTBOX ── */}
      {previewImage && (() => {
        const { photos, index } = previewImage;
        const src = photos[index];
        const hasPrev = index > 0;
        const hasNext = index < photos.length - 1;
        return (
          <div className="lightboxOverlay" onClick={() => setPreviewImage(null)}>
            <button className="lightboxClose" onClick={() => setPreviewImage(null)}>✕</button>

            {hasPrev && (
              <button
                className="lightboxNav lightboxNavPrev"
                onClick={e => { e.stopPropagation(); setPreviewImage({ photos, index: index - 1 }); }}
              >‹</button>
            )}

            <img
              className="lightboxImg"
              src={src}
              alt="preview"
              onClick={e => e.stopPropagation()}
            />

            {hasNext && (
              <button
                className="lightboxNav lightboxNavNext"
                onClick={e => { e.stopPropagation(); setPreviewImage({ photos, index: index + 1 }); }}
              >›</button>
            )}

            {photos.length > 1 && (
              <div className="lightboxCounter" onClick={e => e.stopPropagation()}>
                {index + 1} / {photos.length}
              </div>
            )}
          </div>
        );
      })()}

      {/* ── SUBVIEW: LỊCH SỬ GIAO DỊCH ── */}
      {currentTab === 'lich-su' && (
        <div id="lich-su-view">
          <div className="viewHeader">
            <h2>LỊCH SỬ GIAO DỊCH NỘI BỘ</h2>
            <p className="viewSubtitle">Theo dõi toàn bộ các hoạt động nhập kho, bán hàng và nhận cọc tại các chi nhánh.</p>
          </div>

          {/* Search & Filter bar */}
          <div className="historySearchBar">
            <div className="historySearchBox">
              <svg className="historySearchIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                className="historySearchInput"
                placeholder="Tìm theo tên máy, nhân viên, serial, chi nhánh..."
                value={historyQuery}
                onChange={e => setHistoryQuery(e.target.value)}
                autoComplete="off"
              />
              {historyQuery && (
                <button className="historyClearBtn" onClick={() => setHistoryQuery('')}>✕</button>
              )}
            </div>

            <div className="historyTypeFilter">
              {[
                { value: '',               label: 'Tất cả' },
                { value: LOG_TYPE.IMPORT,  label: 'Nhập kho' },
                { value: LOG_TYPE.DEPOSIT, label: 'Cọc máy' },
                { value: LOG_TYPE.SELL,    label: 'Đã bán' },
                { value: LOG_TYPE.SYSTEM,  label: 'Hệ thống' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  className={`historyTypeBtn ${historyTypeFilter === value ? 'active' : ''} ${value ? LOG_DISPLAY[value]?.cls : ''}`}
                  onClick={() => setHistoryTypeFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="historyDateRange">
              <label>Từ ngày</label>
              <input
                type="date"
                value={historyFromDate}
                onChange={e => setHistoryFromDate(e.target.value)}
              />
              <label>Đến ngày</label>
              <input
                type="date"
                value={historyToDate}
                onChange={e => setHistoryToDate(e.target.value)}
              />
              {(historyFromDate || historyToDate) && (
                <button
                  className="historyDateClearBtn"
                  onClick={() => { setHistoryFromDate(''); setHistoryToDate(''); }}
                >
                  Xóa
                </button>
              )}
            </div>

            <p className="historyResultCount">
              {filteredHistory.length === history.length
                ? `${history.length} giao dịch`
                : `${filteredHistory.length} / ${history.length} giao dịch`}
            </p>
          </div>

          <div className="historyTimeline">
            {filteredHistory.length === 0 ? (
              <div className="noHistory">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <p>Không tìm thấy giao dịch nào phù hợp.</p>
                <button
                  className="historyClearFilterBtn"
                  onClick={() => { setHistoryQuery(''); setHistoryTypeFilter(''); setHistoryFromDate(''); setHistoryToDate(''); }}
                >
                  Xoá bộ lọc
                </button>
              </div>
            ) : (
              filteredHistory.map(log => {
                const { text: typeText, cls: typeClass } = LOG_DISPLAY[log.type] ?? LOG_DISPLAY[LOG_TYPE.SYSTEM];
                const isExpanded = expandedLogId === log.id;
                const linkedProduct = log.serial
                  ? products.find(p => p.serial === log.serial)
                  : products.find(p => log.productName && `${p.brand} ${p.name}` === log.productName);
                const hasProduct = !!linkedProduct;
                const canLink = !!(log.serial || log.productName);

                return (
                  <div
                    key={log.id}
                    className={`historyItem ${isExpanded ? 'expanded' : ''}`}
                    onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && setExpandedLogId(isExpanded ? null : log.id)}
                  >
                    <div className="historyMeta">
                      <span className={`historyType ${typeClass}`}>{typeText}</span>
                      <span className="historyTime">{formatDate(log.date)}</span>
                      <span className="historyExpandIcon">{isExpanded ? '▲' : '▼'}</span>
                    </div>
                    <div className="historyContent">
                      <p className="historyDetails">{log.details}</p>
                      <div className="historyFooter">
                        <span><strong>Người thực hiện:</strong> {log.staff}</span>
                        <span className="dot-separator">•</span>
                        <span><strong>Chi nhánh:</strong> {log.location}</span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="historyExpandBody" onClick={e => e.stopPropagation()}>
                        {log.serial && (
                          <div className="historyExpandRow">
                            <span className="historyExpandLabel">Serial:</span>
                            <span className="historyExpandValue">{log.serial}</span>
                          </div>
                        )}
                        {log.productName && (
                          <div className="historyExpandRow">
                            <span className="historyExpandLabel">Sản phẩm:</span>
                            <span className="historyExpandValue">{log.productName}</span>
                          </div>
                        )}
                        {linkedProduct && (
                          <div className="historyExpandRow">
                            <span className="historyExpandLabel">Trạng thái hiện tại:</span>
                            <span className={`historyExpandStatus status-${linkedProduct.status === PRODUCT_STATUS.IN_STOCK ? 'con' : linkedProduct.status === PRODUCT_STATUS.DEPOSITED ? 'coc' : 'ban'}`}>
                              {linkedProduct.status === PRODUCT_STATUS.IN_STOCK ? 'Còn hàng' : linkedProduct.status === PRODUCT_STATUS.DEPOSITED ? 'Đang giữ cọc' : 'Đã bán'}
                            </span>
                          </div>
                        )}
                        {canLink && (
                          <button
                            className={`historyViewProductBtn ${!hasProduct ? 'deleted' : ''}`}
                            onClick={() => hasProduct ? handleViewProductFromLog(log) : showToast('Sản phẩm đã bị xóa khỏi hệ thống.', 'error')}
                          >
                            {hasProduct ? 'Xem sản phẩm →' : 'Sản phẩm đã xóa'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ── SUBVIEW: THỐNG KÊ DOANH SỐ ── */}
      {currentTab === 'thong-ke' && (
        <div id="thong-ke-view">
          <div className="statsViewHeader">
            <div>
              <h2 style={{ margin: 0 }}>THỐNG KÊ DOANH SỐ</h2>
              <p className="viewSubtitle" style={{ marginTop: 4 }}>Tổng quan hoạt động kinh doanh tại tất cả chi nhánh.</p>
            </div>
            <div className="statsHeaderActions">
              <button className="btnPrintStats" onClick={handlePrintStats}>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 6 2 18 2 18 9"/>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                  <rect x="6" y="14" width="12" height="8"/>
                </svg>
                In báo cáo
              </button>
              <button className="btnExportStats" onClick={handleExportStats}>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Xuất Excel
              </button>
            </div>
          </div>

          {/* Period filter */}
          <div className="statsPeriodFilter">
            {[
              { value: '1m',  label: 'Tháng này' },
              { value: '3m',  label: '3 tháng' },
              { value: '6m',  label: '6 tháng' },
              { value: 'all', label: 'Tất cả' },
            ].map(({ value, label }) => (
              <button
                key={value}
                className={`statsPeriodBtn ${statsPeriod === value ? 'active' : ''}`}
                onClick={() => setStatsPeriod(value)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* KPI Cards */}
          <div className="kpiGrid">
            <div className="kpiCard kpiRevenue">
              <div className="kpiLabel">Doanh thu đã bán</div>
              <div className="kpiValue">{formatRevenue(stats.totalRevenue)}</div>
              <div className="kpiSub">{stats.soldCount} sản phẩm</div>
            </div>
            <div className="kpiCard kpiSold">
              <div className="kpiLabel">Đã bán</div>
              <div className="kpiValue">{stats.soldCount}</div>
              <div className="kpiSub">sản phẩm</div>
            </div>
            <div className="kpiCard kpiDeposit">
              <div className="kpiLabel">Đang giữ cọc</div>
              <div className="kpiValue">{stats.depositedCount}</div>
              <div className="kpiSub">sản phẩm</div>
            </div>
            <div className="kpiCard kpiStock">
              <div className="kpiLabel">Tồn kho</div>
              <div className="kpiValue">{stats.inStockCount}</div>
              <div className="kpiSub">/ {stats.totalCount} tổng</div>
            </div>
          </div>

          {/* Charts row */}
          <div className="statsRow">
            {/* By location */}
            <div className="statsCard">
              <h3 className="statsCardTitle">Doanh thu theo chi nhánh</h3>
              {stats.byLocation.length === 0 ? (
                <p className="statsEmpty">Chưa có dữ liệu bán hàng.</p>
              ) : stats.byLocation.map(({ key, rev, count }) => (
                <div key={key} className="statBarRow">
                  <div className="statBarLabel">{key}</div>
                  <div className="statBarTrack">
                    <div
                      className="statBarFill statBarBlue"
                      style={{ width: `${Math.round(rev / stats.byLocation[0].rev * 100)}%` }}
                    />
                  </div>
                  <div className="statBarMeta">
                    <span className="statBarValue">{formatRevenue(rev)}</span>
                    <span className="statBarCount">{count} máy</span>
                  </div>
                </div>
              ))}
            </div>

            {/* By staff */}
            <div className="statsCard">
              <h3 className="statsCardTitle">Doanh thu theo nhân viên</h3>
              {stats.byStaff.length === 0 ? (
                <p className="statsEmpty">Chưa có dữ liệu bán hàng.</p>
              ) : stats.byStaff.map(({ key, rev, count }) => (
                <div key={key} className="statBarRow">
                  <div className="statBarLabel">{key}</div>
                  <div className="statBarTrack">
                    <div
                      className="statBarFill statBarGreen"
                      style={{ width: `${Math.round(rev / stats.byStaff[0].rev * 100)}%` }}
                    />
                  </div>
                  <div className="statBarMeta">
                    <span className="statBarValue">{formatRevenue(rev)}</span>
                    <span className="statBarCount">{count} máy</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* By brand */}
          <div className="statsCard statsCardFull">
            <h3 className="statsCardTitle">Doanh thu theo thương hiệu</h3>
            {stats.byBrand.length === 0 ? (
              <p className="statsEmpty">Chưa có dữ liệu bán hàng.</p>
            ) : (
              <div className="brandStatsGrid">
                {stats.byBrand.map(({ key, rev, count }) => (
                  <div key={key} className="statBarRow">
                    <div className="statBarLabel">{key}</div>
                    <div className="statBarTrack">
                      <div
                        className="statBarFill statBarRed"
                        style={{ width: `${Math.round(rev / stats.byBrand[0].rev * 100)}%` }}
                      />
                    </div>
                    <div className="statBarMeta">
                      <span className="statBarValue">{formatRevenue(rev)}</span>
                      <span className="statBarCount">{count} máy</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top 5 products */}
          <div className="statsCard statsCardFull">
            <h3 className="statsCardTitle">Top sản phẩm bán được giá cao nhất</h3>
            {stats.topProducts.length === 0 ? (
              <p className="statsEmpty">Chưa có sản phẩm nào được bán.</p>
            ) : stats.topProducts.map((p, i) => (
              <div key={p.id} className="topProductRow">
                <span className={`topProductRank rank-${i + 1}`}>#{i + 1}</span>
                <div className="topProductInfo">
                  <span className="topProductName">{p.brand} {p.name}</span>
                  <span className="topProductMeta">
                    {p.sellInfo?.staff || p.staff}
                    <span className="dot-separator">•</span>
                    {p.sellInfo?.location || p.location}
                    {p.sellInfo?.date && (
                      <>
                        <span className="dot-separator">•</span>
                        {formatDate(p.sellInfo.date).split(' ')[0]}
                      </>
                    )}
                  </span>
                </div>
                <span className="topProductPrice">{formatMoneyRaw(p.price)} đ</span>
              </div>
            ))}
          </div>

          {/* Transaction counts */}
          <div className="statsCard statsCardFull">
            <h3 className="statsCardTitle">Tổng số giao dịch theo loại</h3>
            <div className="logCountGrid">
              {[
                { type: LOG_TYPE.IMPORT,  label: 'Nhập kho', cls: 'type-nhap'  },
                { type: LOG_TYPE.DEPOSIT, label: 'Cọc máy',  cls: 'type-coc'   },
                { type: LOG_TYPE.SELL,    label: 'Đã bán',   cls: 'type-ban'   },
                { type: LOG_TYPE.SYSTEM,  label: 'Hệ thống', cls: 'type-system' },
              ].map(({ type, label, cls }) => (
                <div key={type} className="logCountCard">
                  <span className={`historyType ${cls}`}>{label}</span>
                  <span className="logCountNum">{stats.logCounts[type] ?? 0}</span>
                  <span className="logCountSub">giao dịch</span>
                </div>
              ))}
            </div>
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

              <div className="modalFormFields">
                <div className="modalFieldGroup">
                  <label htmlFor="m-dep-customer-name">Tên khách hàng</label>
                  <input
                    id="m-dep-customer-name"
                    type="text"
                    value={mDepCustomerName}
                    onChange={(e) => setMDepCustomerName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    required
                  />
                </div>
              </div>

              <div className="modalFormFields">
                <div className="modalFieldGroup">
                  <label htmlFor="m-dep-customer-phone">Số điện thoại</label>
                  <input
                    id="m-dep-customer-phone"
                    type="tel"
                    value={mDepCustomerPhone}
                    onChange={(e) => setMDepCustomerPhone(e.target.value)}
                    placeholder="0901234567"
                    pattern="[0-9]+"
                    required
                  />
                </div>
                <div className="modalFieldGroup">
                  <label htmlFor="m-dep-amount">Tiền cọc (VNĐ)</label>
                  <input
                    id="m-dep-amount"
                    type="number"
                    value={mDepAmount}
                    onChange={(e) => setMDepAmount(e.target.value)}
                    placeholder="500000"
                    min="1"
                    required
                  />
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
            <button className="modalCloseBtn" onClick={() => { setSellModalOpen(false); setMSellCustomerName(''); setMSellCustomerPhone(''); setMSellActualPrice(''); }}>
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
              <div className="modalFormFieldsStacked">
                <div className="modalFieldGroup">
                  <label htmlFor="m-sell-customer-name">Tên khách mua *</label>
                  <input
                    id="m-sell-customer-name"
                    type="text"
                    placeholder="Họ tên khách hàng"
                    value={mSellCustomerName}
                    onChange={e => setMSellCustomerName(e.target.value)}
                    required
                  />
                </div>

                <div className="modalFieldGroup">
                  <label htmlFor="m-sell-customer-phone">Số điện thoại *</label>
                  <input
                    id="m-sell-customer-phone"
                    type="tel"
                    placeholder="0xxx xxx xxx"
                    value={mSellCustomerPhone}
                    onChange={e => setMSellCustomerPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="modalFieldGroup">
                  <label htmlFor="m-sell-actual-price">Giá bán thực tế (VNĐ) *</label>
                  <input
                    id="m-sell-actual-price"
                    type="number"
                    placeholder={String(currentProduct.price)}
                    value={mSellActualPrice}
                    onChange={e => setMSellActualPrice(e.target.value)}
                    onFocus={() => { if (!mSellActualPrice) setMSellActualPrice(String(currentProduct.price)); }}
                    min="1"
                    required
                  />
                  {mSellActualPrice && parseInt(mSellActualPrice) < currentProduct.price && (
                    <span style={{fontSize:'12px', color:'#e67e22', marginTop:'4px', display:'block'}}>
                      Giảm giá: {formatMoney(currentProduct.price - parseInt(mSellActualPrice))}
                    </span>
                  )}
                </div>

                <div className="modalFieldGroup">
                  <label htmlFor="m-sell-staff">Nhân viên bán</label>
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
                  <label htmlFor="m-sell-location">Chi nhánh</label>
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

              <button type="submit" className="modalSubmitBtn btnBan" style={{marginTop:'4px'}}>
                XÁC NHẬN ĐÃ BÁN
              </button>
            </form>
          </div>
        </div>
      )}

      {/* RELEASE CONFIRM MODAL (HỦY CỌC / RESET CÒN HÀNG) */}
      {releaseConfirmOpen && currentProduct && (
        <div className="modalOverlay">
          <div className="modalBox deleteModalBox">
            <button className="modalCloseBtn" onClick={() => setReleaseConfirmOpen(false)}>✕</button>
            <div className="deleteModalIcon">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h3 className="deleteModalTitle">
              {currentProduct.status === PRODUCT_STATUS.DEPOSITED ? 'Xác nhận hủy cọc' : 'Xác nhận reset còn hàng'}
            </h3>
            <p className="deleteModalDesc">
              {currentProduct.status === PRODUCT_STATUS.DEPOSITED
                ? <>Bạn sắp <strong>hủy cọc</strong> máy <strong>{currentProduct.brand} {currentProduct.name}</strong>. Thông tin cọc sẽ bị xóa và máy trở về trạng thái <strong>Còn hàng</strong>.</>
                : <>Bạn sắp <strong>reset</strong> máy <strong>{currentProduct.brand} {currentProduct.name}</strong> từ Đã bán về <strong>Còn hàng</strong>. Thông tin bán sẽ bị xóa.</>
              }
            </p>
            <div className="modalFieldGroup" style={{ margin: '12px 0' }}>
              <label style={{ fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>Người thực hiện:</label>
              <select
                value={mReleaseStaff}
                onChange={e => setMReleaseStaff(e.target.value)}
                style={{ flex: 1, height: 36, borderRadius: 8, border: '1px solid var(--border-light)', padding: '0 12px', fontFamily: 'inherit', fontSize: 13 }}
              >
                {STAFFS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="deleteModalActions">
              <button className="cancelEditBtn" onClick={() => setReleaseConfirmOpen(false)}>HỦY</button>
              <button
                className="modalSubmitBtn"
                style={{ background: 'var(--brand-dark)' }}
                onClick={() => { handleReleaseProduct(); setReleaseConfirmOpen(false); }}
              >
                XÁC NHẬN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalOpen && currentProduct && (
        <div className="modalOverlay" id="delete-modal">
          <div className="modalBox deleteModalBox">
            <button className="modalCloseBtn" onClick={() => setDeleteModalOpen(false)}>✕</button>

            <div className="deleteModalIcon">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </div>

            <h3 className="deleteModalTitle">Xác nhận xoá sản phẩm</h3>
            <p className="deleteModalDesc">
              Bạn sắp xoá <strong>{currentProduct.brand} {currentProduct.name}</strong>
              {' '}(Serial: {currentProduct.serial}) khỏi hệ thống.
              <br/>Hành động này không thể hoàn tác.
            </p>

            <div className="deleteModalActions">
              <button className="cancelEditBtn" onClick={() => setDeleteModalOpen(false)}>
                HỦY
              </button>
              <button className="modalSubmitBtn btnDeleteConfirm" onClick={handleDeleteProduct}>
                XOÁ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
