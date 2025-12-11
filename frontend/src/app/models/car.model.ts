export interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateCarDto {
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  description: string;
}

export interface UpdateCarDto extends CreateCarDto {
  id: number;
}

