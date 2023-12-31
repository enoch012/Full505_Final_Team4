package com.bitc.full505_final_team4.controller;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.web.bind.annotation.*;

import java.util.*;

//@CrossOrigin(origins = {"http://localhost:3000"})
@RestController
public class TestController {


  @RequestMapping("/hello")
  public List<String> hello() {
    return Arrays.asList("안녕하세요", "Hello");
  }


  // 검색 결과 데이터 가져오기
  /*@RequestMapping(value = "/jsoup", method = RequestMethod.GET)
  public Object searchList() throws Exception {

    // 네이버 검색결과 데이터 Jsoup 활용하여 가져오기
    List<String> titleList = new ArrayList<>();
    String searchUrl = "https://series.naver.com/search/search.series?t=novel&q=사람";


    Document doc = Jsoup.connect(searchUrl).get();

    Elements titles = doc.getElementsByClass("N=a:nov.title");

    for (Element e : titles) {
      int titleIndex = e.text().indexOf("(");
      String title = e.text().substring(0, titleIndex);

      titleList.add(title);

    }
  }*/

  // 검색 결과 데이터 가져오기
  @RequestMapping(value = "/jsoup", method = RequestMethod.GET)
  public Object searchList () throws Exception {

    // 네이버 검색결과 데이터 Jsoup 활용하여 가져오기
    List<String> titleList = new ArrayList<>();
    String searchUrl = "https://series.naver.com/search/search.series?t=novel&q=사람";

    Document doc = Jsoup.connect(searchUrl).get();
    Elements titles = doc.getElementsByClass("N=a:nov.title");

    for (Element e : titles) {
      titleList.add(e.text());
    }

    return titleList;
  }

}
