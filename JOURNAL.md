STORING ARRAYS

-I stored arrays as a string.
-On retrieval, I parse the string.
  -There doesn't seem to be a difference in performance between JSON.parsing the string before sending the strings to client as JSON

-Working on Product Styles which uses data from 3 sources (Product_Styles, SKUs, and Photos).
-Tried triple join with product_ID as the shared key
  - this returned multiple permutations of column combinations.  A lot of repeat data.  SLOW.
  - Much faster was doing a select query for each individual piece of data even without product_id.
  - Will try doing a select all for product_id for SKUs and Photos


-Curious to see what happens if I implement a simple object storage for cacheing in the server.js

6/27/21
Added simple cache to the server.  It resets on each isntance of the server.  It doesn't seem to have any effect on postman requests.  Will switch to K9 for testing.


6/28/21

BASELINE
  LOCAL TESTING ON POSTMAN FOR

Short circuit api endpoint by returning a 200 status immediately.

Single GETs Every +- 20s
endpoint: /products/<'product id'>


Socket init:    1.55 |
TCP Handshake:  0.27 |
Transfer start: 1.11 |
Download:       7.16 |

Total:            12 |





Product ID:        54 | 999999| 1000000
Socket init:     1.04 | .5    | s
DNS lookup:           | .11   |
TCP Handshake:   0.52 | .25   |
Transfer start: 38.83 | 12.62 | 8.26
Download:        1.98 | 1.94

Total:          46 ms |


Tests on postman consistently returned uncached results at around 29ms.  Transfer start seems to be the most costly part of the process.]

I heard that postman takes particularly long.  i'll try k6 testing.


K6 testing endpoint ./products

     data_received..................: 1.5 kB 27 kB/s
     data_sent......................: 88 B   1.6 kB/s
     http_req_blocked...............: avg=1.44ms  min=1.44ms  med=1.44ms  max=1.44ms  p(90)=1.44ms  p(95)=1.44ms
     http_req_connecting............: avg=598µs   min=598µs   med=598µs   max=598µs   p(90)=598µs   p(95)=598µs
     http_req_duration..............: avg=29.61ms min=29.61ms med=29.61ms max=29.61ms p(90)=29.61ms p(95)=29.61ms
       { expected_response:true }...: avg=29.61ms min=29.61ms med=29.61ms max=29.61ms p(90)=29.61ms p(95)=29.61ms
     http_req_failed................: 0.00%  ✓ 0 ✗ 1
     http_req_receiving.............: avg=926µs   min=926µs   med=926µs   max=926µs   p(90)=926µs   p(95)=926µs
     http_req_sending...............: avg=3.41ms  min=3.41ms  med=3.41ms  max=3.41ms  p(90)=3.41ms  p(95)=3.41ms
     http_req_tls_handshaking.......: avg=0s      min=0s      med=0s      max=0s      p(90)=0s      p(95)=0s
     http_req_waiting...............: avg=25.28ms min=25.28ms med=25.28ms max=25.28ms p(90)=25.28ms p(95)=25.28ms
     http_reqs......................: 1      18.258837/s
     iteration_duration.............: avg=46.01ms min=46.01ms med=46.01ms max=46.01ms p(90)=46.01ms p(95)=46.01ms
     iterations.....................: 1      18.258837/s



     DEPLOYMENT

    -Set up amazon account
    -Chose 2 Ubuntu free tier EC2 instances, one for my server and one for my database.
    -Once the transaction went through, I had two instances shown on my dashboard.  I had to connect to them which gave me various options of how to connect.  There is one CLI option that you can copy and paste into the terminal.  You have to take out the double quotes around the pem key as well as the spaces.  Basically type it in exactly how it is on your computer
    -Once I was in, I had to update and upgrade my instance.  It felt like walking into an unused public city storage unit.
    -I installed node using all of these commands given to us by Hack Reactor and then reconfigured port 80 to redirect traffic to port 3000 which is the port that my server uses in my server scripts.  I tried to fire up the server but it immediately gave me an error because firing up server.js also fires up a connection to the SQL database that the scripts refer to.  I hadn't yet installed MySQL, and I wasn't supposed to on this instance anyway.
    -This was a point at which I needed to figure out how to decouple my server instance scripts from the database scripts.  I'm still in the midst of figuring this out.
    -In the meantime, I decided to do what I knew was within my immediate reach which was to spin up a new instance for my database.  In that instance, I downloaded MySQL for Ubuntu using a link that Stephen gave us during the junior phase.
    -The first problem that arose once MySQL finished downloading was accessing it.  The first time I downloaded MYsql it was from a GUI, and in that installation process, the GUI gave me an initial temporary password.  Stephen had also given us some commands within the mysql cli to change the temp password to our own. Now, on the ec2, I had done it purely from the command line as the command line is the only interface I have with the ec2.  And there was no prompt to a temporary password.  Somehow Varun figured out that using the sudo command, we could break into the mysql cli, within which we could make a new username and assign a new password.  I tried to change the password of my root user with:

      SET PASSWORD FOR 'root'@'localhost' = PASSWORD('somepassword')
      FLUSH PRIVILEGES

    It didn't work, so I went ahead and made a new username sulisulisulwan and gave it a password.

    I cloned down the codebase from github and attempted to run the server.js within products.  It didn't work.  I got an authorization error.  I googled the error and looked up stackoverflow which got me around to some advice saying that I needed to change my root user's password.  As the previous technique didn't work, I was hesistant but I decided to try once more:

    ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'

    FLUSH PRIVILEGES

    mysql_native_password is the actual thing you're supposed to write.  It worked, I was able to reassign a new password to root, and as a result I was able to fire up server.js.

    With this having been solved, I had to then figure out how I would get the csv files into my database.  First i tried uploading the files to github.  That did not work as the push to main would fail midway due to the large size of some of the CSV files.  I talked to Varun and he mentioned that Tim mentioned about using an SSH technique which was some kind of file-transfer-protocol that would allow one to send files from a local location to a remote location.  So I looked it up and found the following command

    scp -i ~/Desktop/../../<pem key file> ~/Desktop/etc.etc./fileToTransfer.CSV ubuntu@ec2-54-166-etc.etc.compute-1.amazonaws.com:~/Desktop/coding_projects/etc.etc./raw_data

    So basically:

    scp -i <aws pem key locatin> <output file location> ubuntu@ec2instance:<input location>

    I was able to upload all of them while on a zoom call with all of my hack reactor buddies.  but goddamn it, photos as usual was the culprit of a failed file transfer.  i actually had to get off the zoom call in order to give my computer the bandwith to send that bigass file to my ec2 instance.  SSH SCP works wonders.  It's amazing.  I can't wait to use it more often.  It is so simple and direct, and I think I might be able to memorize the command for future use.

    What's next?  I need to begin populating my db.  Let's see if it works.



    June 30, 2021
    VARUN SENT MY WAY:
    alter table tblname add index idx_name (col name)

    TODO: Need to redo all of this by indexing column Product_ID of Product_Styles to allow for constant time look up.  Also index columns Style_ID of Photos and SKUs to allow for constant time look up.  Then possibly do joined tables for SKUs and Photos on Style_ID column.



    -Every time an ec2 instance is created,

    -Server instance
    TODO:
      Needs to allow in requests.
sudo apt-get update && sudo apt-get upgrade -y
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install gcc g++ make
sudo apt-get install git
git clone https://github.com/sulisulisulwan/database-pyrenees.git
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
set up dbConfig.j
npm install
node server.js
run postman
      Expose port 80 to 0.0.0.0
      Map port 80 to the express server port (3000 or whatever it is)
      Every time the server instance is terminated or stopped, the above needs to be repeated for the new IP address of the server.
      Set up mysql credentials in db.js

    -Database instance
      - Ubuntu
      - Security for each port 0.0.0.0
      - Install mysql for ubuntu
      - Break into mysql with sudo command
      - allow for a foreign user to use the database
      - CREATE USER 'my-app-user'@'%' IDENTIFIED BY 'my-app-password';
        GRANT ALL ON *.* TO 'my-app-user'@'%';
      - NOT SURE IF THIS IS NECESSARY dealing with the mysql config file https://www.youtube.com/watch?v=PVo70d-BkUg&t=201s

LOADER IO
  -Download token txt
  -create a public folder in the /products folder
  -scp tokent to the ec2 instance public folder directory
  -create an endpoint in server.js at one of the endpoints that they list.  It should be the same value as the token
  -






DATA
SEARCH FOR BASE CASE
  PRODUCT STYLES ENDPOINT

1000 clients/second for 1 min
  Success 60,000/60,000

1300 clients/sec for 1 min
  Success 78,000/78,000
1400 clients/sec for 1 min
  Success 83,998/84,000
1500 clients/sec for 1 min
  Success 89,993/90,000


2000 clients/sec for 1 min
  Success 119991/120000
  Error rate 0%

2750 clients/sec for 1 min
  Success 164982
  Error rate 0


3000 clients/sec/min
  Success 179968/ 180000 | 179970
  Error rate 0% | 0

3050
  Success 172924 | 176827
  Error 0.4 |0.3

------------------------------
3075
  Success 166268 | 129437
  Error 0.8 | 0.7
------------------------------

3100 clients/sec/min
  Success 110337
  Error rate 0.8

3250
  Success  117032 (timeout 3208)
  Error rate 2.7
3500 clients/sec/min
  Success 199804/210000 | 168906 timeout(2566)
  Error rate 0.7% | 1.5%
4000 clients/sec/min
  Success 127791/240000
  Error rate 2.1%



UPDATED, MORE STRICT BASE CASE.  Requests/sec/minute at randomized endpoints ALL the time.
GOALS:
  Error rate: < 1%
  Response time: < 2000 ms under load
  Throughput: 100 requests/second


100
  100% success
  Error rate 0%
  Aberage 16 ms
  Min/Max 14 / 56 ms
200
  100% success
  Error rate 0%
  Average	24 ms
  Min/Max	14 / 411 ms


250 SEEMS TO BE THE CEILING WHERE WE STAY STABLE BELOW 50ms.
--------------------------------------------------------------------
250
  15000 |
  Error rate 0%
  Average 20ms | 20ms
  Min/Max 14 / 71 ms | 14/179
-------------------------------------------------------------------

280
  16800 | 15782 | 16367 (910)
  Error rate 0
  Average	61 ms | 1377ms  | 1292
  Min/Max	14 / 369 ms | 18/2183 | 22 / 2091 ms

270
  16200
  Error rate 0
  Average	219 ms
  Min/Max	14 / 539 ms
300
  16588
  Error rate 0%
  Average	1530 ms
  Min/Max	18 / 2313 ms
500
  Aberage 3020ms
  Min/Max 22 / 4045 ms
800
  Error rate 0%
  Average	3048 ms
  Min/Max	28 / 3915 ms
1000
  Error rate 0%
  Average	6660 ms
  Min/Max	37 / 8027 ms


1200
  Success 15863
  Average 7822 ms
  Error rate 0%

1300
  Error rate 4.2% | 10.4 | 0.1  | 0.3
  Average 8592 ms | 8724 | 8426 | 8508

CEILING FOR BELOW 10% ERROR RATE
--------------------------------------------------------
1330
  Error rate  5%  |  0   | 0.1  | 3.3 | 20.5 | 0.1 |
             8775 | 8456 | 8548 | 8625 | 8945| 8522|
--------------------------------------------------------
1350
  Error rate 1.5% | 7.2    | 1.2    | 0.3  | 56% | 54.8 |
                  | 8842ms | 8629ms | 8505 |

1360
  Error rate 14.3 | 35.0   | 1.5  | 7.5
  Average 8898ms  | 9123ms | 8780 | 8876


1370
  Error rate 8.1 | 29.6
  Average 8846ms | 9069ms
1380
  Error rate 24.5
1400
  Error rate 53.3
1500
  Error rate 53.5%
2000
  Error rate 55.8%
2500
  Error rate 69.5%



=============================================================
ADDING A LOAD BALANCER (2 SERVERS)
=============================================================
GOALS:
  Error rate: < 1%
  Response time: < 2000 ms under load
  Throughput: 100 requests/second


HYPOTHESIS 500 speed ceiling
HYPOTHESIS 2600 ERROR ceiling

400
Error rate 0          | 0      | -       |         |
Average 35 ms         | 23     | 31      | 18      |
Min/Max 14/417        | 14/208 | 14/405  | 14 /184 |
Success 23890         | 23889  | 24000   | 24000   |
400/500 0/0 Network 0 | 0/0 0  | -       |         |

450
Error rate 0    | -      | -       |
Average 580     | 291    | 827     |
Min/Max 14/1703 | 14/940 | 14/2419 |
Success 26828   | 26937  | 26574   |
400/500 0/0     | -      | -       |

500 -----hypothesis optimistic
Error rate 0.0 % | 0
Average	1318 ms         | 1409     |
Min/Max	14/3742 ms      | 14/4367  |
Success	26413	Timeout	0 | 25812 0  |
400/500	0/0	Network	0   | 0/0 0    |




600
Error rate 0.0 % | 0
Average	1852 ms         |  1853   | 1867
Min/Max	14/4932 ms      | 15/4593 | 14/4589
Success	26363	Timeout	0 |  26856  | 26773
400/500	0/0	Network	0   |  -      |


THIS IS THE SWEET SPOT
-----------------------------------------
610
Error rate 0.0        | -
Average 1940          | 1884
Min/Max 14/5028       | 14/4713
Success 26456         | 26927
400/500 0/0 Network 0 | -

625
Error rate 0.0        | -
Average   2010        | 2081
Min/Max   16/4788     | 15/5286
Success   26720       | 26352
400/500 0/0 Network 0 | -
------------------------------------------
650
Error rate 0.0        |
Average   2206        |
Min/Max   17/5861     |
Success   25646       |
400/500 0/0 Network 0 |

700
Error rate 0.0 % | 0
Average 2326         |
Min/Max 15 / 5770    |
Success 26978        |
400/500 0/0 Network 0|


====================================
4 SERVERS
====================================

GOALS:
  Error rate: < 1%
  Response time: < 2000 ms under load
  Throughput: 100 requests/second

HYPOTHESIS 800




DROP OFF FOR OPTIMAL SPEED
--------------------------
700
Error rate 0.0 %
Average 20ms
Min/Max 14/255
Success 42000
400/500 0/0 Network 0

800
Error rate 0.0 %
Average 68 ms
Min/Max 14/681
Success 48000
400/500 0/0 Network 0
----------------------------




900
Error rate 0.0 %
Average 829 ms
Min/Max 14/5180 ms
Success 53340
400/500 0/0 Network 0

1000
Error rate 0.0 %
Average 1330 ms
Min/Max 14/6527 ms
Success 54143
400/500 0/0 Network 0




UPPER BOUNDS FOR SPEED
---------------------------------------
1200
Error rate 0.0%       |
Average 1796          | 1857
Min/Max 16/8134       | 15/ 8227
Success 55828         | 54911
400/500 0/0 Network 0 |

1250
Error rate 0.0% |
Average 1906| 1958
Min/Max 16/9123| 16/8651
Success 54529| 54836
400/500 0/0 Network 0 |

1300
Error rate 0.0%       |         |
Average 1998ms        | 2003ms  | 2022
Min/Max 16/8793 ms    | 17/8641 | 17/8991
Success 56404         | 56386   | 55773
400/500 0/0 Network 0 |
---------------------------------------





1500
Error rate 0.0 %
Average 2362 ms
Min/Max 16/9632 ms
Success 57023
400/500 0/0 Network 0


UPPER LIMIT FOR ERRORS
-------------------------------
1800
Error rate 0.1 %
Average 3065 ms
Min/Max 17/10008 ms
Success 55478 Timeout 66
400/500 0/0 Network 0

1900


2000
Error rate 1.7 %
Average 3572 ms
Min/Max 18/10009 ms
Success 52385 Timeout 896
400/500 0/0 Network 0
-------------------------------







=================================================
8 SERVERS
=================================================
HYPOTHESIS
UPPER LIMIT OF SPEED 2600
UPPER LIMIT OF ERRORS 3600





1000
Error rate 0% |
Average 19ms |
Min/Max 14/527 ms |
Success 59999 |





DROP OFF POINT FOR OPTIMAL SPEED
--------------------
1100
Error rate 0%
Average 27ms
Min/Max 14/288ms
Success 66000

1150
Error rate 0%
Average 79ms
Min/Max 14/870ms
Success 69000
--------------------



1200
Error rate 0%
Average 307ms
Min/Max 14/1004 ms
Success 72000



UPPER BOUNDS FOR SPEED
---------------------------------------
1600
Error rate 0%
Average 1994          | 1992    | 1903
Min/Max 15/3429       | 13/4148 | 16/3586
Success 72592         | 71623   | 74493
400/500 0/0 Network 0
---------------------------------------




2100
Error rate 0%
Average 2717 ms
Min/Max 16/4648 ms
Success 73855
400/500 0/0 Network 0

2600 hypothesis optimistic
Error rate 0 %
Average 3479 ms
Min/Max 16/5961 ms
Success 73599
400/500 0/0 Network 0

4500

UPPER ERROR BOUND UNTIL THE EC2 LOAD BALANCER SEEMINGLY BROKE DOWN ENTIRELY
----------------------------------------------------------------------------
4700s
Error rate 0.1 %           | 48.2
Average 6901 ms            | 7829
Min/Max 18/10207 ms        | 22 11051
Success 71875 Timeout 1332 | 30351 28244
400/500 0/0 Network 0      | 0 0 0


4800
Error rate 0.1 %           | 6.8
Average 6901 ms            | 6707
Min/Max 18/10207 ms        | 17 10205
Success 71875 Timeout 1332 | 67105 4938
400/500 0/0 Network 0      | 0 0 0
-----------------------------------------------------------------------------
4900
Error rate 4.6 %
Average 6755 ms
Min/Max 17/10207 ms
Success 69827 Timeout 3376
400/500 0/0 Network 0

5000
Error rate 1.8 %
Average 6901 ms
Min/Max 18/10207 ms
Success 71875 Timeout 1332
400/500 0/0 Network 0







==================
1 SERVER UNINHIBITED BY QUERIES
=================

500
  12ms, 0err
1000
  12ms
2000
  13ms
2500
  1566 ms 0.7%
2750
  1875 ms 1%
3000
  2071 ms 1.3%
4000
  2984ms 5.6%

====================
RELATED 1 SERVER
==================
500
  13ms 0% 7.41MB
1000
  14ms 0% 7.38MB
1250
  1783 ms 8.3mb
1500
  2262 ms 0%
2000
  31000 ms 0% 8.43 Mb


==================
4 SERVERS UNINHIBITED BY QUERIES
=================

5000
  13ms 0% 51.57MB
7000
  13ms 0% 72.45 MB
9000
  665 ms 0.9% 93.15MB
10000
  1421ms 2.4% 

==================
4 SERVERS RELATED
=================
4000
  1534ms 36.37MB 0% ER
4500
  1982ms 35.88 0% ER A few 500 errors
5000
  2216ms 36.78MB mb
==================
8 SERVERS UNINHIBITED
=================
10000
  13ms 103.8 mb 0%
==================
8 SERVERS RELATED
=================
3000
  47
4500
5000
  75ms 52MB
6000
   670ms 61MB
7000
  786ms 69MB
8000
  1953ms 64MB mb 0%

  