-- Insert sample users
INSERT INTO users (wallet_address, username, email, bio, avatar_url) VALUES
('0x1234567890123456789012345678901234567890', 'alice_data', 'alice@example.com', 'AI researcher and data scientist', '/placeholder.svg?height=100&width=100'),
('0x2345678901234567890123456789012345678901', 'bob_models', 'bob@example.com', 'ML engineer specializing in computer vision', '/placeholder.svg?height=100&width=100'),
('0x3456789012345678901234567890123456789012', 'carol_ai', 'carol@example.com', 'Data analyst and marketplace enthusiast', '/placeholder.svg?height=100&width=100')
ON CONFLICT (wallet_address) DO NOTHING;

-- Insert sample datasets
INSERT INTO datasets (title, description, category, price, file_url, file_size, file_type, preview_url, owner_wallet, downloads, views, rating, rating_count) VALUES
('High-Quality Image Dataset', 'A comprehensive collection of 100,000+ labeled images for computer vision tasks', 'Computer Vision', 0.5, '/datasets/images.zip', 5368709120, 'ZIP', '/placeholder.svg?height=200&width=300', '0x1234567890123456789012345678901234567890', 1250, 3400, 4.8, 124),
('Financial Time Series Data', 'Historical stock market data with indicators and sentiment analysis', 'Finance', 0.3, '/datasets/finance.csv', 2147483648, 'CSV', '/placeholder.svg?height=200&width=300', '0x2345678901234567890123456789012345678901', 890, 2100, 4.6, 89),
('Medical Imaging Dataset', 'Anonymized X-ray and CT scan images for medical AI research', 'Healthcare', 1.2, '/datasets/medical.zip', 10737418240, 'ZIP', '/placeholder.svg?height=200&width=300', '0x1234567890123456789012345678901234567890', 567, 1800, 4.9, 67),
('NLP Text Corpus', 'Multi-language text dataset for natural language processing tasks', 'Natural Language', 0.4, '/datasets/nlp.txt', 3221225472, 'TXT', '/placeholder.svg?height=200&width=300', '0x3456789012345678901234567890123456789012', 2100, 5600, 4.7, 210),
('Social Media Sentiment Analysis', 'Comprehensive social media posts dataset with sentiment labels for emotion detection', 'Natural Language', 0.45, '/datasets/sentiment.csv', 1610612736, 'CSV', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-CDtvNewIOVmcmI5HgkaXWIe1nyLd9C.png', '0x3456789012345678901234567890123456789012', 1450, 4200, 4.8, 145)
ON CONFLICT DO NOTHING;

-- Insert sample AI models
INSERT INTO ai_models (name, description, category, model_type, price, file_url, file_size, framework, architecture, accuracy, owner_wallet, downloads, views, rating, rating_count) VALUES
('ResNet-50 Image Classifier', 'Pre-trained ResNet-50 model fine-tuned on custom dataset', 'Computer Vision', 'Classification', 0.8, '/models/resnet50.pth', 102400000, 'PyTorch', 'ResNet-50', 94.5, '0x2345678901234567890123456789012345678901', 456, 1200, 4.8, 45),
('BERT Sentiment Analyzer', 'Fine-tuned BERT model for sentiment analysis with 95% accuracy', 'Natural Language', 'NLP', 0.6, '/models/bert.bin', 438000000, 'TensorFlow', 'BERT-base', 95.2, '0x1234567890123456789012345678901234567890', 789, 2300, 4.9, 78),
('Object Detection Model', 'YOLOv8 model trained for real-time object detection', 'Computer Vision', 'Detection', 1.0, '/models/yolov8.onnx', 256000000, 'ONNX', 'YOLOv8', 92.8, '0x3456789012345678901234567890123456789012', 1234, 3500, 4.7, 123),
('Time Series Forecaster', 'LSTM-based model for financial time series prediction', 'Finance', 'Forecasting', 0.7, '/models/lstm.h5', 89000000, 'Keras', 'LSTM', 88.6, '0x2345678901234567890123456789012345678901', 345, 980, 4.6, 34)
ON CONFLICT DO NOTHING;
