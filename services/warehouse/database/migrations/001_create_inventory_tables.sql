-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    merchant_id VARCHAR(36) NOT NULL,
    variant_id VARCHAR(36),
    quantity INT NOT NULL DEFAULT 0,
    reserved_quantity INT NOT NULL DEFAULT 0,
    available_quantity INT GENERATED ALWAYS AS (quantity - reserved_quantity) STORED,
    reorder_level INT DEFAULT 10,
    reorder_quantity INT DEFAULT 50,
    warehouse_location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_product_id (product_id),
    INDEX idx_merchant_id (merchant_id),
    INDEX idx_variant_id (variant_id),
    UNIQUE KEY unique_inventory (product_id, merchant_id, variant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create inventory_logs table
CREATE TABLE IF NOT EXISTS inventory_logs (
    id VARCHAR(36) PRIMARY KEY,
    inventory_id VARCHAR(36) NOT NULL,
    type ENUM('add', 'deduct', 'reserve', 'release', 'adjustment') NOT NULL,
    quantity INT NOT NULL,
    previous_quantity INT NOT NULL,
    new_quantity INT NOT NULL,
    reference_id VARCHAR(36),
    reference_type VARCHAR(50),
    notes TEXT,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE CASCADE,
    INDEX idx_inventory_id (inventory_id),
    INDEX idx_type (type),
    INDEX idx_reference (reference_id, reference_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create reserved_stock table
CREATE TABLE IF NOT EXISTS reserved_stock (
    id VARCHAR(36) PRIMARY KEY,
    inventory_id VARCHAR(36) NOT NULL,
    order_id VARCHAR(36) NOT NULL,
    quantity INT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    status ENUM('active', 'released', 'confirmed') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE CASCADE,
    INDEX idx_inventory_id (inventory_id),
    INDEX idx_order_id (order_id),
    INDEX idx_status (status),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
