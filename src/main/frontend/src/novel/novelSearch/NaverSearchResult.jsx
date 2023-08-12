import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import axios from "axios";

function NaverSearchResult(props) {
  // const [searchWord, setSearchWord] = useState(props.keyword);
  
  const [novelSearchList, setNovelSearchList]= useState([]);
  
  useEffect(() => {
    axios.get('/searchNaver', {
      params : {
        searchWord: props.keyword
      }
    })
      .then(res => {
        const item = res.data;
        // console.log(res);
        let naverSearchList = [];
        
        if(Object.keys(res.data) != 0) {
          for (let i = 0; i < item.title.length; i++) {
            // const item = res.data;
            const data = {
              platform: 2,
              platformId: item.platformId[i],
              title: item.title[i].includes('[') ? item.title[i].substring(0, item.title[i].indexOf('[')) : item.title[i],
              thumbnail: item.thumbnail[i],
              author: item.author[i],
              starRate: item.starRate[i],
              completeYn: item.completeYn[i],
              count: item.count[i],
              description: item.dsc[i],
              ageGrade: item.ageGrade[i],
              novelOrEbook: item.title[i].includes('[단행본]') ? '단행본' : '웹소설'
            }
            naverSearchList.push(data);
          }
          setNovelSearchList(naverSearchList);
        }
        setNovelSearchList(naverSearchList);
      })
      .catch(err => {
        console.log(err.message);
      })
    
  }, [props.keyword])
  
  return (
    <div>
      {
        novelSearchList.length != 0
        ? novelSearchList.map((item, index) => {
          return (
            <div className={'row my-4 border-top border-bottom py-2'} key={index}>
              <div className={'col-sm-2'}>
                <Link to={`/novelDetail?platformId=${item.platformId}&title=${item.title}&novelOrEbook=${item.novelOrEbook}`} >
                  <img src={item.thumbnail} alt="" className={'w-100 h-100'} />
                </Link>
              </div>
              <div className={'col-sm-10'}>
                <Link to={`/novelDetail?platformId=${item.platformId}&title=${item.title}&novelOrEbook=${item.novelOrEbook}`} className={'text-decoration-none text-black fs-5 fw-bold'}>{item.title} <span className={'text-danger'}>{item.ageGrade == "Y" ? "[성인]" : null}</span>
                </Link><br/>
                <p className={'search-info'}>작가 : {item.author}</p>

                {
                  item.price != null
                    ? <p className={'search-info search-price fw-bold'}>가격 : {item.price}</p>
                    : <p className={'search-info search-price text-muted'}>{null}</p>
                }
                <div className={'d-flex'}>
                  <p className={'search-info'}>
                    평점 <span className={'fw-bold search-score'}>{item.starRate}</span>&nbsp;|
                  </p>
                  <p>
                    &nbsp;<span className={'fw-bold'}>{item.completeYn}
                    {
                      item.title.indexOf('[단행본]') == -1
                      ? <span>&nbsp;(총{item.count}화)</span>
                      : <span>&nbsp;(총{item.count}권)</span>
                    }
                  </span>
                  </p>
                </div>
                <p className={'mt-3'}>{item.description.substring(0, 300)}</p>
                
              </div>
            </div>
          )
        })
        : <div className={'d-flex justify-content-center'}>
          <p className={'my-5'}><span className={'fw-bold'}>'{props.keyword}'</span>로 조회된 검색 결과가 없습니다.</p>
        </div>
      }
    </div>
  )
}

export default NaverSearchResult;