package com.bitc.full505_final_team4.service;

import java.util.List;
import java.util.Map;

public interface NovelSearchService {
  List<String> getKakaoSearchIdList(String searchWord) throws Exception;

  Map<String, Object> getNaverSearchList(String searchWord) throws Exception;

//  Map<String, Object> getRidiSearchList(String searchWord) throws Exception;
}
