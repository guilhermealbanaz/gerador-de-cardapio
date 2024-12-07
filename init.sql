-- Create tables
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url TEXT,
    user_id UUID NOT NULL,
    subscription_status VARCHAR(50) DEFAULT 'free',
    subscription_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE menus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    restaurant_id UUID NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    menu_id UUID NOT NULL,
    "order" INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (menu_id) REFERENCES menus(id)
);

CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    category_id UUID NOT NULL,
    "order" INTEGER NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Insert sample data
-- Insert a user
INSERT INTO users (id, name, email, password, role)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'John Doe',
    'john@example.com',
    '$2b$10$rK7EF.nK3o5Gl.jQ5TnOZ.zZ5I/B5Lx5WyS5yR5CA95IGy7tQzgC2', -- password: 123456
    'admin'
);

-- Insert a restaurant
INSERT INTO restaurants (id, name, description, user_id)
VALUES (
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Restaurant Demo',
    'A sample restaurant',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
);

-- Insert a menu
INSERT INTO menus (id, name, description, restaurant_id)
VALUES (
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Menu Principal',
    'Cardápio principal do restaurante',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
);

-- Insert categories
INSERT INTO categories (id, name, description, menu_id, "order")
VALUES 
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Entradas', 'Pratos para começar bem', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1),
    ('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Pratos Principais', 'Nossos melhores pratos', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 2),
    ('d2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Sobremesas', 'Para finalizar com doçura', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 3);

-- Insert items
INSERT INTO items (name, description, price, category_id, "order")
VALUES 
    ('Bruschetta', 'Pão italiano com tomates e manjericão', 25.90, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1),
    ('Carpaccio', 'Finas fatias de carne com molho especial', 45.90, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 2),
    
    ('Filé à Parmegiana', 'Filé empanado com molho de tomate e queijo', 89.90, 'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1),
    ('Salmão Grelhado', 'Salmão grelhado com legumes', 98.90, 'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 2),
    
    ('Pudim', 'Pudim de leite condensado', 18.90, 'd2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1),
    ('Petit Gateau', 'Bolo de chocolate com sorvete', 25.90, 'd2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 2);
