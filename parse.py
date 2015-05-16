import xlrd
import MySQLdb
import sys
import site

def is_number(s):
    try:
        float(s) # for int, long and float
    except ValueError:
        try:
            complex(s) # for complex
        except ValueError:
            return False

    return True


fname = raw_input('Enter the file name: ')
try:

     con = MySQLdb.connect(host= "localhost",
                           user="root",
                           passwd="root",
                           db="geicodb")
     cur = con.cursor()

     workbook = xlrd.open_workbook(fname)
     worksheet = workbook.sheet_by_name('Addendum')
     num_rows = worksheet.nrows - 1
     curr_row = -1
     while curr_row < num_rows:
          curr_row += 1
	  row = worksheet.row(curr_row)
          if (is_number(worksheet.cell_value(curr_row, 0))): 
               cell_value = worksheet.cell_value(curr_row, 0)
	       print int(cell_value) 
               print worksheet.cell_value(curr_row, 1)
               first = worksheet.cell_value(curr_row, 2)
               first = first.encode("utf-8")
               last = worksheet.cell_value(curr_row, 1)
               last = last.encode("utf-8")
               id = int(cell_value)
               is_available = True 
               court_type = worksheet.cell_value(curr_row, 4)
               court_type = court_type.encode("utf-8")
               venue_county = worksheet.cell_value(curr_row, 5)
               venue_county = venue_county.encode("utf-8")
               cancellation_reason = ''
 
               insertstmt=("INSERT IGNORE into doctors (first_name,last_name,"+
                           "expert_id,is_available,court_type,venue_county,"+
                           "cancellation_reason) values "+
                           '("%s", "%s", "%d", "%r", "%s","%s","%s")' % (first,last,id,is_available,court_type,venue_county,cancellation_reason))
               print insertstmt
               cur.execute(insertstmt)


     con.commit()
     con.close()

except:
     print 'File cannot be opened:', fname
     exit()


