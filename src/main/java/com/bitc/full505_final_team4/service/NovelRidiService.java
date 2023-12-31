package com.bitc.full505_final_team4.service;

import com.bitc.full505_final_team4.data.dto.NovelMainDto;
import com.bitc.full505_final_team4.data.entity.NovelEntity;
import com.bitc.full505_final_team4.data.entity.NovelPlatformEntity;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.util.List;

public interface NovelRidiService {

  // 오늘 날짜의 리디북스 카테고리 별 순위 리스트 저장하기
  boolean storeRidiCategoryRankList (int category, int startNum) throws Exception;

  /* 리디북스 카테고리 별 순위 리스트 불러오기 */
  List<NovelMainDto> getRidiRankList(String category, int startNum) throws Exception;

  // 리디북스 최신작 리스트 불러온 후 테이블에 없는 작품 저장하기(특정 카테고리별)
  boolean storeRidiRecentNovel(int category) throws Exception;

  // json object 에 있는 novel table 관련 데이터 entity 형태로 들고오기
  NovelEntity getCateNovelEntityFromJson(JSONObject novel) throws Exception;

  // json object 에 있는 platform table 관련 데이터 entity 형태로 들고오기
  NovelPlatformEntity getCatePlatformEntityFromJson(NovelEntity novelEntity, JSONObject novelData) throws Exception;

  // 작품 아이디에 해당하는 연재일 들고오기
  String getNovelUpdateDate(String platformId) throws Exception;

  // 작품 아이디에 해당하는 작품 설명 들고오기
  String getNovelIntro(String platformId) throws Exception;

  // 작품 출시일 들고오기
  String getReleaseDate(String infoDate) throws Exception;

  /* 리디 별점 계산기 */
  double getStarRate(JSONArray ratings) throws Exception;

  // 리디 카테고리 pk 생성 관련
  int ridiCategoryRankNum(int category) throws Exception;

  // 리디 카테고리 번호에 따라 장르명 변환 (메인 노출용)
  String ridiRankCategoryNameConverter(int category) throws Exception;

  // DB 저장용 카테고리 변환
  String cateListConverterIn(String cateItem) throws Exception;

  // ridi ebook check 변환 함수
  String getEbookCheck(String ebookCheck) throws Exception;

  // adult_yn 변환 함수
  String getAdultYn(String info) throws Exception;
}
