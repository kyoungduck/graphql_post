# GraphQL 성능 체크

## 테스트 환경 및 조건

##### 서버 하드웨어 환경

- MacBook Pro (13-inch, 2019)
- 2.4 GHz 쿼드 코어 Intel Core i5
- 8GB 2133 MHz LPDDR3

##### 테스트 조건

|     조건     |              수치              |
| :----------: | :----------------------------: |
|    유저수    |            500,000             |
|  총 친구 수  | 2,064,716(유저당 평균: 4.13명) |
| 총 게시글 수 | 1,506,700(유저당 평균: 3.01개) |

##### 클러스터링

Pm2 모듈을 클러스터 모드로 돌려서 총 8개의 프로세스를 생성하고 pm2내부 Load Balancer를 이용함.

##### 부하테스트 모듈

[K6]: https://k6.io/	"k6"

## 테스트 쿼리

##### 1. 유저 리스트(유저 30명)

```gql
query{
  userList(pageNum: 1, amount: 30){
    id
    email
    username
  }
}
```



##### 2. 유저 리스트와 친구리스트

```gql
query{
  userList(pageNum: 1, amount: 30){
    id
    email
    username
    friends{
      id
      email
      username
    }
  }
}
```



##### 3. 유저 리스트와 친구리스트, 친구가 작성한 게시글 리스트

```gql
query{
  userList(pageNum: 1, amount: 30){
    id
    email
    username
    friends{
      id
      email
      username
      writePost{
        id
        title
        content
      }
    }
  }
}
```



## 부하 테스트

한번 요청당 20번, 총 10초동안 돌아가게하여(초당 2번) 가상 유저수를 늘려 60초동안 안정적인 서비스가 되는 가상유저수를 찾는다(그 가상 유저수 X 2 가 서버가 안정적으로 보장하는 TPS가 됨).

##### 유저 리스트 쿼리 테스트

```bash
$ k6 run load_test/userList.js --duration 60s --vus 610
... 생략 ...

data_received..............: 204 MB 3.4 MB/s
    data_sent..................: 21 MB  351 kB/s
    http_req_blocked...........: avg=175.03µs min=1µs    med=2µs      max=80.4ms   p(90)=4µs      p(95)=8µs     
    http_req_connecting........: avg=154.24µs min=0s     med=0s       max=60.71ms  p(90)=0s       p(95)=0s      
    http_req_duration..........: avg=411.51ms min=3.33ms med=403.01ms max=2.26s    p(90)=531.28ms p(95)=660.86ms
    http_req_receiving.........: avg=162.59µs min=16µs   med=48µs     max=385.46ms p(90)=143µs    p(95)=285µs   
    http_req_sending...........: avg=82.1µs   min=6µs    med=14µs     max=323.66ms p(90)=27µs     p(95)=41µs    
    http_req_tls_handshaking...: avg=0s       min=0s     med=0s       max=0s       p(90)=0s       p(95)=0s      
    http_req_waiting...........: avg=411.27ms min=3.24ms med=402.9ms  max=2.26s    p(90)=530.91ms p(95)=659.96ms
    http_reqs..................: 73173  1219.549778/s
    iteration_duration.........: avg=10s      min=9.99s  med=10s      max=10.03s   p(90)=10.01s   p(95)=10.01s  
    iterations.................: 3053   50.883324/s
    vus........................: 610    min=610 max=610
    vus_max....................: 610    min=610 max=610
```

가상유저를 610으로 설정했을 경우에 오류가 없었으며 총 1219개의 Request을 Response를 포함하여 처리했습니다.

##### 유저 리스트 & 친구 리스트 테스트

```bash
$ k6 run load_test/userAndFriends.js --duration 60s --vus 150
... 생략 ...

data_received..............: 232 MB 3.9 MB/s
    data_sent..................: 8.6 MB 142 kB/s
    http_req_blocked...........: avg=27.93µs  min=1µs     med=2µs      max=12.91ms p(90)=4µs      p(95)=4µs     
    http_req_connecting........: avg=6.71µs   min=0s      med=0s       max=9.61ms  p(90)=0s       p(95)=0s      
    http_req_duration..........: avg=402.1ms  min=12.72ms med=412.05ms max=1.03s   p(90)=485.98ms p(95)=510.98ms
    http_req_receiving.........: avg=94.59µs  min=22µs    med=62µs     max=2.96ms  p(90)=123µs    p(95)=309µs   
    http_req_sending...........: avg=19.78µs  min=6µs     med=15µs     max=5.54ms  p(90)=23µs     p(95)=29µs    
    http_req_tls_handshaking...: avg=0s       min=0s      med=0s       max=0s      p(90)=0s       p(95)=0s      
    http_req_waiting...........: avg=401.98ms min=12.62ms med=411.97ms max=1.03s   p(90)=485.85ms p(95)=510.88ms
    http_reqs..................: 18000  299.999434/s
    iteration_duration.........: avg=10s      min=9.99s   med=10s      max=10.03s  p(90)=10.01s   p(95)=10.01s  
    iterations.................: 756    12.599976/s
    vus........................: 150    min=150 max=150
    vus_max....................: 150    min=150 max=150

```

가상유저를 150으로 설정했을 경우에 오류가 없었으며 총 299.9개의 Request을 Response를 포함하여 처리했습니다.

##### 유저 리스트 & 친구 리스트 & 게시글 리스트 테스트

```bash
$ k6 run load_test/userFriendsPosts.js --duration 60s --vus 19
... 생략 ...

data_received..............: 347 MB 5.8 MB/s
    data_sent..................: 1.4 MB 23 kB/s
    http_req_blocked...........: avg=10.87µs  min=1µs     med=3µs      max=1.17ms  p(90)=4µs      p(95)=5µs     
    http_req_connecting........: avg=3.56µs   min=0s      med=0s       max=535µs   p(90)=0s       p(95)=0s      
    http_req_duration..........: avg=337.67ms min=86.81ms med=320.92ms max=760.1ms p(90)=486.21ms p(95)=511.64ms
    http_req_receiving.........: avg=155.89µs min=59µs    med=127µs    max=2.46ms  p(90)=226µs    p(95)=303.19µs
    http_req_sending...........: avg=22.73µs  min=8µs     med=19µs     max=764µs   p(90)=30µs     p(95)=38µs    
    http_req_tls_handshaking...: avg=0s       min=0s      med=0s       max=0s      p(90)=0s       p(95)=0s      
    http_req_waiting...........: avg=337.49ms min=86.7ms  med=320.79ms max=759.9ms p(90)=486.07ms p(95)=511.53ms
    http_reqs..................: 2280   37.999989/s
    iteration_duration.........: avg=10s      min=9.99s   med=10s      max=10s     p(90)=10s      p(95)=10s     
    iterations.................: 99     1.65/s
    vus........................: 19     min=19 max=19
    vus_max....................: 19     min=19 max=19

```

가상유저를 19으로 설정했을 경우에 오류가 없었으며 총 37.9개의 Request을 Response를 포함하여 처리했습니다.

## 결과

|                Query 내용                | GraphQL Depth |  TPS   |
| :--------------------------------------: | :-----------: | :----: |
|               유저 리스트                |       1       | 1219.5 |
|        유저 리스트 & 친구 리스트         |       2       | 299.9  |
| 유저 리스트 & 친구 리스트 & 게시글리스트 |       3       |  37.9  |



## 결론

- dataloader를 적용하였음에도 불구하고 깊이가 한번 깊어질때마다 상당한 성능 절감이 있었음.
- 쿼리를 계층화하고 하위 리졸버를 만들경우 성능에 대해서 고민해 봐야하며 과도한 성능을 유발하는 쿼리를 막을 필요가 있음

성능 절감을 피하기 위한 전략으로는 다음과 같은 라이브러리를 사용할 수 있다

https://github.com/pa-bru/graphql-cost-analysis - 쿼리 비용을 계산하여 최대 비용을 막는 방법

https://github.com/stems/graphql-depth-limit/ - 쿼리 깊이 자체를 제한 하는 방법