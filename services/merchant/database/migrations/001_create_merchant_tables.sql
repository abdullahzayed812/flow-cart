-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
    id VARCHAR(36) PRIMARY KEY,
    merchant_id VARCHAR(36) UNIQUE NOT NULL,
    store_name VARCHAR(255) NOT NULL,
    store_description TEXT,
    store_logo VARCHAR(500),
    store_banner VARCHAR(500),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_merchant_id (merchant_id),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create store_settings table
CREATE TABLE IF NOT EXISTS store_settings (
    id VARCHAR(36) PRIMARY KEY,
    store_id VARCHAR(36) UNIQUE NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    tax_rate DECIMAL(5, 2) DEFAULT 0.00,
    shipping_fee DECIMAL(10, 2) DEFAULT 0.00,
    free_shipping_threshold DECIMAL(10, 2),
    return_policy TEXT,
    terms_and_conditions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create merchant_payouts table
CREATE TABLE IF NOT EXISTS merchant_payouts (
    id VARCHAR(36) PRIMARY KEY,
    merchant_id VARCHAR(36) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'failed') NOT NULL DEFAULT 'pending',
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    notes TEXT,
    INDEX idx_merchant_id (merchant_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
