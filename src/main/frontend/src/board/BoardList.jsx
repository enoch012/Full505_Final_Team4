import React, {useEffect, useState} from 'react';
import {Col, Form, Row} from "react-bootstrap";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";

function BoardList(props) {

  const navi = useNavigate();
  //페이지가 변할 때 cate 값 0으로 초기화 - 검색 종류 cate
  const [cate, setCate] = useState(0);
  const [keyword, setKeyword] = useState('');
  // 카테고리 변경 시 페이지 번호가 0으로 초기화 x
  const [type, setType] = useState('');
  const [nowPage, setNowPage] = useState(0);
  const [endPage, setEndPage] = useState(0);
  const [pages, setPages] = useState([1]);
  const [boardList, setBoardList] = useState([{}]);

  useEffect(() => {
    setType(props.data.type);
    setNowPage(props.defaultPage);
  }, [])

  useEffect(() => {
    if (type != props.data.type) {
      setType(props.data.type);
      setNowPage(0);
    }
    requestData();
    setCate(0);
    setKeyword('');
  }, [props.data, nowPage]);

  const requestData = () => {
    axios.get(`/${props.data.type}?page=${nowPage}&size=10`)
        .then(res => {

          console.log(res.data);
          
          let arr = [];
          let now = res.data.nowPage;
          let end = res.data.totalPages;
          let firstPage = now - 2 > 0 ? now - 2 : 1;
          let lastPage = now + 2 > end ? end : now + 2;
          if (lastPage === end) {
            console.log('if')
            firstPage = end - 4 > 1 ? end - 4 : 1;
          }
          if (firstPage === 1) {
            lastPage = end > 5 ? 5 : end;
          }

          for (let i = firstPage; i <= lastPage; i++) {
            arr.push(i);
          }
          console.log(`arr : ${arr}, first : ${firstPage}, last : ${lastPage}, nowPage : ${now}, total: ${end}`);

          setPages(arr);
          setEndPage(res.data.totalPages);
          setBoardList(res.data.boardList);
        })
        .catch(err => {
          alert(`통신에 실패했습니다. err : ${err}`);
        })
  }

  const handleSubmit = (event) => {
    axios.get(`/board/${cate}/${keyword}`)
        .then(res => {
          setBoardList(res.data.boardList);
          setPages([1]);
        })
        .catch(err => {
          alert(`통신에 실패했습니다. err : ${err}`);
        })
    // 검색 기능 API 구현
    event.preventDefault();
  }

  const moveDetail = (url) => {
    navi(url);
  }
  return (
      <Row className={''}>
        <Col xs={10} className={'my-5 mx-auto'}>
          <Row className={'d-flex align-items-center border-black py-2 mb-3'}>
            <Col className={'ps-0'}><h3 className={'fw-bold board-title'}>{props.data.title}</h3></Col>
            {
                (props.data.id === 0) &&
                (<Col className={'pe-0 me-3'}>
                  <form onSubmit={handleSubmit}>
                    <Row className={'d-flex align-items-center'}>
                      <Col className={'px-0'}>
                        <Form.Select
                            className={'select-box cursor fw-bold'}
                            value={cate}
                            onChange={(e) => setCate(e.target.value)}
                        >
                          <option value={0}>제목</option>
                          <option value={1}>작성자</option>
                        </Form.Select>
                      </Col>
                      <Col xs={9} className={'search-bar ps-1'}>
                        <div className={''}>
                          <input
                              type={'text'}
                              value={keyword}
                              placeholder={'검색어를 입력하세요'}
                              onChange={(e) => setKeyword(e.target.value)}
                          />
                          <button type={'submit'}><i className="bi bi-search"></i></button>
                        </div>
                      </Col>
                    </Row>
                  </form>
                </Col>)}
          </Row>
          <Row>
            <table className={'text-center table-hover table board-table px-0 mx-0'}>
              <colgroup>
                <col width={'10%'}/>
                <col width={'60%'}/>
                <col width={'15%'}/>
                <col width={'15%'}/>
              </colgroup>
              <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>작성자</th>
                <th>날짜</th>
              </tr>
              </thead>
              <tbody>
              {
                boardList.map((board, index) => {
                  if (sessionStorage.getItem('id') == board.createId || sessionStorage.getItem('grade') == 2 || (type != 'req')) {
                    return (
                        <tr
                            key={index}
                            onClick={() => {
                              moveDetail(`/board/detail/${props.data.id}/${board.boardIdx}`)
                            }}
                        >
                          <td>{board.boardIdx}</td>
                          <td className={'text-start cursor'}>
                            {
                                (board.reqCate != "") &&
                                (<span className={'list-cate me-1'}>{board.reqCate}</span>)
                            }
                            {board.boardTitle}
                          </td>
                          <td>{board.nickName}</td>
                          <td>{board.createDt}</td>
                        </tr>
                    )
                  } else {
                    return (
                        <tr key={index}>
                          <td>{board.boardIdx}</td>
                          <td className={'text-start cursor'}>비밀글 입니다.</td>
                          <td>{board.nickName}</td>
                          <td>{board.createDt}</td>
                        </tr>
                    )
                  }

                })
              }
              </tbody>
            </table>
            <div className={'d-flex justify-content-between ps-0 align-items-center'}>
              <div className={'p-0'}></div>
              <div className={'mx-auto my-3 pages cursor'}>
                <a
                    className={nowPage <= 0 ? 'text-black-50' : ''}
                    onClick={() => {
                      if (nowPage <= 0) {
                        return null
                      }
                      return setNowPage(0)
                    }}
                ><i className="bi bi-chevron-double-left"></i>
                </a>
                <a
                    className={nowPage <= 0 ? 'text-black-50' : ''}
                    onClick={() => {
                      if (nowPage <= 0) {
                        return null
                      }
                      return setNowPage(nowPage - 1)
                    }}>
                  <i className="bi bi-chevron-left"></i>
                </a>
                {
                  pages.map((value) => {
                    return (
                        <a
                            key={value}
                            className={nowPage === value - 1 ? 'selected-page mx-2' : 'text-black-50 mx-2'}
                            onClick={() => setNowPage(value - 1)}
                        >{value}</a>);
                  })
                }
                <a
                    className={nowPage >= endPage - 1 ? 'text-black-50' : ''}
                    onClick={() => {
                      if (nowPage >= endPage - 1) {
                        return null
                      }
                      return setNowPage(nowPage + 1)
                    }}
                ><i className="bi bi-chevron-right"></i>
                </a>
                <a
                    className={nowPage >= endPage - 1 ? 'text-black-50' : ''}
                    onClick={() => {
                      if (nowPage >= endPage - 1) {
                        return null
                      }
                      return setNowPage(endPage - 1)
                    }}
                ><i className="bi bi-chevron-double-right"></i>
                </a>

              </div>
              <div className={''}>
                {
                  // 특정 조건에서만 랜더링 코드
                    ((props.data.type === 'req' &&
                            sessionStorage.getItem('id') != null) ||
                        (sessionStorage.getItem('grade') == 2)) &&
                    (<Link to={`/board/write/${props.data.id}`} className={'btn btn-purple purple-round px-4'}>글
                      쓰기</Link>)
                }

              </div>
            </div>
          </Row>
        </Col>
      </Row>
  )
}

export default BoardList;