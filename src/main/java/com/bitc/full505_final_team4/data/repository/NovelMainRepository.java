package com.bitc.full505_final_team4.data.repository;

import com.bitc.full505_final_team4.data.entity.NovelEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// service main 패키지와 연동되는 repository
public interface NovelMainRepository extends JpaRepository<NovelEntity, Integer> {
  // 소설 제목으로 select 하기
  Optional<NovelEntity> findByNovelTitle(String title);

  // 소설 idx 로 찾기
  Optional<NovelEntity> findByNovelIdx(int idx);

  // 제목, 웹소설 여부로 찾기
  Optional<NovelEntity> findByNovelTitleAndEbookCheck(String title, String ebookCheck);

  // 제목, 웹소설 여부, 성인 작품 여부로 찾기
  Optional<NovelEntity> findByNovelTitleAndEbookCheckAndNovelAdult(String title, String ebookCheck, String novelAdult);

//  NovelEntity findByNovelTitle(String title);

}
