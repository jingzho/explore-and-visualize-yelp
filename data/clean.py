import xlrd 
import nltk
import re
import unicodedata
import csv

loc = ("toronto.xlsx")
wb = xlrd.open_workbook(loc)
monday = []
sheet = wb.sheet_by_index(0)
start = []
start_time = []
end = []
end_time = []
# 3032
for i in range(1,9021): 
	time = sheet.cell_value(i,12)
	time = unicodedata.normalize('NFKD', time).encode('ascii', 'ignore')
	monday.append(re.split('-',time))
	#time.append(re.split(':',monday))

for element in monday:
	start_time.append(re.split(':',element[0]))
	end_time.append(re.split(':',element[1]))


for l in range(len(start_time)):
	if int(start_time[l][0]) > 9:
		start.append('20'+str(start_time[l][0]))
	else:
		start.append('200'+str(start_time[l][0]))


for i in range(len(end_time)):
	if end_time[i][0] == '0':
		end.append('2024')
	elif int(end_time[i][0]) > 9:
		end.append('20' + str(end_time[i][0]))
	elif end_time[i][0] in ['1','2','3','4','5','6','7','8','9']:
		end.append('20' + str(int(end_time[i][0])+24))

# print start
# print end

with open("map_toronto.csv", "w") as fp:
	csv_writer = csv.writer(fp, delimiter=',')
	for i in range(len(start)):
		csv_writer.writerow([start[i], end[i]])

	# print result
