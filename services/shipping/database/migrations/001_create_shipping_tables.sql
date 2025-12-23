-- Create shipments table
CREATE TABLE IF NOT EXISTS shipments (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    tracking_number VARCHAR(100) UNIQUE NOT NULL,
    courier_id VARCHAR(36),
    courier_name VARCHAR(100),
    status ENUM('created', 'assigned', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned') NOT NULL DEFAULT 'created',
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    estimated_delivery TIMESTAMP,
    actual_delivery TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order_id (order_id),
    INDEX idx_tracking_number (tracking_number),
    INDEX idx_courier_id (courier_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create courier_locations table
CREATE TABLE IF NOT EXISTS courier_locations (
    id VARCHAR(36) PRIMARY KEY,
    courier_id VARCHAR(36) NOT NULL,
    shipment_id VARCHAR(36),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    accuracy DECIMAL(10, 2),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_courier_id (courier_id),
    INDEX idx_shipment_id (shipment_id),
    INDEX idx_recorded_at (recorded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create delivery_events table
CREATE TABLE IF NOT EXISTS delivery_events (
    id VARCHAR(36) PRIMARY KEY,
    shipment_id VARCHAR(36) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    description TEXT,
    location TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE,
    INDEX idx_shipment_id (shipment_id),
    INDEX idx_event_type (event_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
