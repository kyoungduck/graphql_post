import http from 'k6/http';
import { sleep } from 'k6';

const headers = {
  'Content-Type': 'application/json',
};

export default () => {
  const before = new Date().getTime();
  const T = 10; // time needed to complete a VU iteration


  for (let i = 0; i < 20; i++) {
    http.post(
      'http://localhost:3000/graphql',
      JSON.stringify({
        query: `query getUser($page:Int!){
                    userList(pageNum: $page, amount: 30){
                      id
                      email
                      username
                      friends{
                        id
                        email
                        username                       
                      }
                    }
                  }`,
        variables: {
          page: i + 1
        }
      }),
      { headers },
    );
  }

  const after = new Date().getTime();
  const diff = (after - before) / 1000;
  const remainder = T - diff;
  if (remainder > 0) {
    sleep(remainder);
  } else {
    console.warn(`Timer exhausted! The execution time of the test took longer than ${T} seconds`);
  }
}
