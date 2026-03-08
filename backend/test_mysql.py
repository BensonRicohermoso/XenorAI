import mysql.connector
from mysql.connector import Error

# Direct credentials test
password = "Benson7202006."

print("Testing MySQL connection with provided credentials...")
print(f"User: root")
print(f"Host: localhost")
print(f"Password length: {len(password)} characters")
print()

try:
    connection = mysql.connector.connect(
        host='localhost',
        port=3306,
        user='root',
        password=password
    )
    
    if connection.is_connected():
        print("✅ Connection successful!")
        cursor = connection.cursor()
        cursor.execute("SELECT VERSION()")
        version = cursor.fetchone()
        print(f"MySQL version: {version[0]}")
        cursor.close()
        connection.close()
    else:
        print("❌ Connection failed")
        
except Error as e:
    print(f"❌ Error: {e}")
    print("\nPossible issues:")
    print("1. Wrong password")
    print("2. MySQL server not running")
    print("3. User 'root' doesn't have proper permissions")
