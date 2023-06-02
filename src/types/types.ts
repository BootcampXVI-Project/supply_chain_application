export type UserRole =
	| "supplier"
	| "manufacturer"
	| "distributor"
	| "retailer"
	| "consumer";
export const UserRoleArray = [
	"supplier",
	"manufacturer",
	"distributor",
	"retailer",
	"consumer"
];

export type ProductStatus =
	| "CULTIVATING"
	| "HARVESTED"
	| "IMPORTED"
	| "MANUFACTURED"
	| "EXPORTED"
	| "DISTRIBUTED"
	| "SELLING"
	| "SOLD";
export const ProductStatusArray = [
	"CULTIVATING",
	"HARVESTED",
	"IMPORTED",
	"MANUFACTURED",
	"EXPORTED",
	"DISTRIBUTED",
	"SELLING",
	"SOLD"
];

export type UserStatus = "active" | "inactive";
export const UserStatusArray = ["active", "inactive"];

export type OrderStatus = "NOT-SHIPPED-YET" | "SHIPPING" | "SHIPPED";
export const OrderStatusArray = ["NOT-SHIPPED-YET", "SHIPPING", "SHIPPED"];
