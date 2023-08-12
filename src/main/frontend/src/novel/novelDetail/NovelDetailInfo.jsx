import React, {useEffect, useState} from 'react';
import axios from "axios";

function NovelDetailInfo(props) {
  // const [platformId, setPlatformId] = useState(props.platformId);
  const [novelInfo, setNovelInfo] = useState({});
  
  useEffect( () => {
    // console.log(props.title);
    // console.log(props.platformId);
    // console.log(props.novelOrEbook);
    const fetchData = async () => {
      try {
        const res = await axios.get("/novelDetail", {
          params: {
            platformId: props.platformId
          }
        })
        // console.log(res);
        // DB에 저장되어있는지 유무 확인
        if (Object.keys(res.data).length !== 0) {
          // DB에 저장되어 있다면 db에서 platform 데이터 들고와서 novelInfo 변경하기
          // console.log(res.data);
          setNovelInfo(res.data);
        }
        else {
          // DB에 저장되어 있지 않다면 DB에 저장
          
          // 리디북스 디테일 페이지 정보 크롤링
          const ridiRes = await axios.get(`https://ridibooks.com/api/search-api/search?adult_exclude=n&keyword=${props.title}`);
          console.log(ridiRes);
          
          let item = {};
          for (let i = 0; i < ridiRes.data.books.length; i++) {
            // 리디북스에 해당 작품 동일한 이름이 있으면 db 저장, 없으면 카카오/네이버 검색 시도
            if (props.title == ridiRes.data.books[i].title) {
              if (props.novelOrEbook === '단행본') {
                if (ridiRes.data.books[i].web_title.includes('[e북]')) {
                  item = ridiRes.data.books[i];
                }
              }
              console.log(item.b_id);
  
              const ridiRes2 = await axios.get(`https://book-api.ridibooks.com/books/${item.b_id}`);
              console.log(ridiRes2);
              const item2 = ridiRes2.data;
              // console.log(item2);
  
              const ridiRes3 = await axios.get(`https://book-api.ridibooks.com/books/${item.b_id}/notices`);
              console.log(ridiRes3);
  
              const item3 = ridiRes3.data.notices;
              console.log(item3);
  
              const ridiObj = {
                platform: 3,
                platformId: item.b_id,
                novelTitle: item.title,
                novelThumbnail: "https://img.ridicdn.net/cover/"+ item.b_id +"/xxlarge",
                novelIntro: item.desc.replace(/<\/?[^>]+(>|$)/g, "").substring(13),
                novelAuthor: item.authors_info.map(auth => {
                  return auth.name;
                }).toString(),
                novelPubli: item.publisher,
                novelCount: item.book_count,
                novelPrice : item.price != 0 ? item.price : item.series_prices_info[0].max_price,
                novelStarRate: item.buyer_rating_score,
                novelCompleteYn: item.is_series_complete ? "Y" : "N",
                novelAdult: item.age_limit == 19 ? "Y" : "N",
                novelRelease: item2.publish.ridibooks_register.substring(0, 10),
                novelUpdateDate: item3.length == 0 ? null : item3[0].title,
                cateList: item.parent_category_name.includes('BL') ? "7" : item.parent_category_name.includes("로맨스") ? "3" : item.parent_category_name.includes("로판") ? "4" : item.parent_category_name.includes("판타지") ? "1" : null,
                novelOrEbook: item.web_title.includes("e북") ? "단행본" : "웹소설"
              };
  
              // 리디북스 디테일 정보 디비에 저장
              const ridiRes4 = await axios.post('/ridiNovelDetail', null, {
                params: {
                  platform: ridiObj.platform,
                  platformId: ridiObj.platformId,
                  novelTitle: ridiObj.novelTitle,
                  novelThumbnail: ridiObj.novelThumbnail,
                  novelIntro: ridiObj.novelIntro,
                  novelAuthor: ridiObj.novelAuthor,
                  novelPubli: ridiObj.novelPubli,
                  novelCount: ridiObj.novelCount,
                  novelPrice : ridiObj.novelPrice,
                  novelStarRate: ridiObj.novelStarRate,
                  novelCompleteYn: ridiObj.novelCompleteYn,
                  novelAdult: ridiObj.novelAdult,
                  novelRelease: ridiObj.novelRelease,
                  novelUpdateDate: ridiObj.novelUpdateDate,
                  cateList: ridiObj.cateList,
                  novelOrEbook: ridiObj.novelOrEbook
                }
              })
            }
          }



          
          
          
          // 서버에서 카카오, 네이버 디테일 크롤링(로그인 포함) -> db 저장
          const kaNaRes = await axios.post('/kaNaNovelDetail', null, {
            params: {
              platformId: props.platformId,
              novelTitle: props.title,
              novelOrEbook: props.novelOrEbook
            }
          })
          
          // fetchData를 다시 실행되게 해서 db에 저장된 데이터를 불러오게끔
          // fetchData();
          
        }
        
      }
      catch (err) {
        console.log(err.message);
      }
    }
    fetchData();
    
  }, [props.platformId])
  
  return (
    <div>
      {novelInfo.ridi && novelInfo.ridi.novelTitle}
    </div>
  )
}

export default NovelDetailInfo;