const a = {
	Product1: {
		product: null,
		count: 15
	},
	Product2: {
		product: null,
		count: 12
	},
	Product3: {
		product: null,
		count: 11
	},
	Product4: {
		product: null,
		count: 14
	},
	Product5: {
		product: null,
		count: 18
	},
	Product6: {
		product: null,
		count: 10
	}
};


// Chuyển đổi đối tượng thành mảng các cặp key-value
const entries = Object.entries(a);

// Sắp xếp mảng theo giá trị count giảm dần
entries.sort((a, b) => b[1].count - a[1].count);

// Lấy 3 phần tử đầu tiên
const top3Elements = entries.slice(0, 3);

// Tạo đối tượng mới từ mảng top3Elements
const result = Object.fromEntries(top3Elements);