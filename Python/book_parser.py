#!/usr/bin/python3
import pymysql

con = pymysql.connect(host="localhost",user="root",password='root',database='LIBRARY')
cur = con.cursor()

print("Hello")

#   open the file 'books.csv' as read-only as assign it the file handle 'f'
f = open('books.csv', 'r', encoding="utf-8")

#   Skip the header row, i.e. first row, by reading it and doing nothing with it
#   This line isn't needed if the header row is manually deleted from books.csv
f.readline()

# This is so we can stop after a few lines
rowCounter = 0

author_id = 1
book_id   = 1
for line in f:
    cols = line.split("\t")  # split each line into a list of column values
    authors = cols[3].split(",")    # split the fourth column (authors) on commas
    cols = cols[1:3]          # only keep the 2nd and 3rd columns: isbn13, and title
    
    # create a single string by joining the columns with comma delimiters and quotes
    bookValues = '"' + '","'.join(cols) + '"'

    # create insert statements for each book row
    cur.execute("INSERT INTO Book (book_id, isbn, title) VALUES (" + str(book_id) + "," + bookValues + ");")

    #   Iterate through each of author of this book row,
    #   Inserting a row Authors table for each author and a row in Book_authors,
    #   pairing each author of the current book row.
    for auth in authors:
        # CHECK FIRST TO MAKE SURE THIS AUTHOR WASN'T ALREADY INSERTED IN THE "Authors" TABLE
        cur.execute("INSERT INTO Authors (author_id, name) VALUES (" + str(author_id) + ",\"" + str(auth) + "\");")
        # IF THAT author already exists in Authors table, use that author_id for "INSERT INTO Book_authors"
        cur.execute("INSERT INTO Book_authors (book_id, author_id) VALUES (" + str(book_id) + "," + str(author_id) + ");")        
        author_id += 1  #   Increment to generate next author_id

    book_id += 1    #   Increment to generate next book_id
    
    rowCounter += 1
    if(rowCounter > 10): # Stop after 10 lines
        break

con.commit()

f.close()# # with open('books.csv', encoding="utf-8") as f:
