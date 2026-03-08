# MySQL Database Setup Guide for XenorAI

This guide will help you set up the MySQL database for XenorAI chatbot.

## Prerequisites

- MySQL Server 8.0 or higher installed on your system
- MySQL Command Line Client or MySQL Workbench

## Installation Steps

### Step 1: Install MySQL (if not already installed)

**Windows:**

1. Download MySQL Installer from: https://dev.mysql.com/downloads/installer/
2. Run the installer and choose "Server only" or "Full" installation
3. During setup, set a root password (remember this password!)
4. Complete the installation

**Mac (using Homebrew):**

```bash
brew install mysql
brew services start mysql
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

### Step 2: Create Database and Tables

1. Open MySQL Command Line Client or MySQL Workbench

2. Login with your root account:

```bash
mysql -u root -p
```

3. Run the database setup script:

```bash
mysql -u root -p < database_setup.sql
```

Or manually execute the SQL commands from `database_setup.sql`

### Step 3: Update Environment Configuration

1. Edit the `.env` file in the backend folder

2. Update the database credentials:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=xenorai_db
```

### Step 4: Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Step 5: Test the Connection

Run the backend server:

```bash
python main.py
```

Check the health endpoint:

```
http://localhost:8000/health
```

You should see:

```json
{
  "status": "healthy",
  "database": "connected",
  "responses_count": 36
}
```

## Database Schema

### `responses` table

| Column           | Type         | Description                                         |
| ---------------- | ------------ | --------------------------------------------------- |
| id               | INT (PK)     | Auto-increment primary key                          |
| question_pattern | VARCHAR(500) | Regex pattern to match user questions               |
| answer           | TEXT         | Predefined response text                            |
| category         | VARCHAR(100) | Category of the response (greeting, farewell, etc.) |
| created_at       | TIMESTAMP    | When the response was created                       |

## Adding New Responses

To add new responses to the chatbot:

```sql
USE xenorai_db;

INSERT INTO responses (question_pattern, answer, category) VALUES
('your regex pattern|alternative pattern', 'Your response text here', 'category_name');
```

### Pattern Matching Examples

- Exact match: `hello`
- Multiple alternatives: `hi|hello|hey`
- Any text: `.*`
- Word boundaries: `\\bhello\\b`

## Troubleshooting

### Connection Failed

1. Check if MySQL service is running:

```bash
# Windows
net start MySQL80

# Mac/Linux
sudo service mysql status
```

2. Verify credentials in `.env` file

3. Check if database exists:

```sql
SHOW DATABASES;
```

### No Responses Found

1. Verify data is loaded:

```sql
USE xenorai_db;
SELECT COUNT(*) FROM responses;
```

2. If count is 0, re-run the database_setup.sql script

### Permission Denied

1. Grant necessary privileges:

```sql
GRANT ALL PRIVILEGES ON xenorai_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

## Backup and Restore

### Backup

```bash
mysqldump -u root -p xenorai_db > xenorai_backup.sql
```

### Restore

```bash
mysql -u root -p xenorai_db < xenorai_backup.sql
```

## Security Tips

1. **Never use root in production** - Create a dedicated user:

```sql
CREATE USER 'xenorai_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT ON xenorai_db.* TO 'xenorai_user'@'localhost';
FLUSH PRIVILEGES;
```

2. **Update .env with new credentials**

3. **Keep .env in .gitignore** - Never commit database passwords!

## Support

For issues or questions about MySQL setup, please refer to:

- MySQL Documentation: https://dev.mysql.com/doc/
- Stack Overflow: https://stackoverflow.com/questions/tagged/mysql
