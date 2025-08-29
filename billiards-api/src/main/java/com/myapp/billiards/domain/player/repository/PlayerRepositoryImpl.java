package com.myapp.billiards.domain.player.repository;

import com.myapp.billiards.domain.player.dto.PlayerListResponse;
import com.myapp.billiards.domain.player.dto.QPlayerListResponse;
import com.myapp.billiards.domain.player.dto.QPlayerListResponse_Rating;
import com.myapp.billiards.domain.player.entity.QPlayer;
import com.myapp.billiards.domain.rating.entity.QPlayerRating;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;

import static com.myapp.billiards.domain.player.entity.QPlayer.player;
import static com.myapp.billiards.domain.rating.entity.QPlayerRating.playerRating;

@RequiredArgsConstructor
public class PlayerRepositoryImpl implements PlayerRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;


    @Override
    public List<PlayerListResponse> findAllPlayersByTeam() {
        return jpaQueryFactory
                .select(
                        new QPlayerListResponse(
                                player.id,
                                player.playerName,
                                new QPlayerListResponse_Rating(
                                        playerRating.average,
                                        playerRating.cushion,
                                        playerRating.points
                                )
                        )
                )
                .from(player)
                .join(player.playerRating, playerRating)
                .orderBy(playerRating.average.desc(), playerRating.cushion.desc())
                .fetch();
    }
}
