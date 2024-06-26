import { useMemo } from 'react';

import sum from 'lodash/sum';

const emptyStats = {
  playerId: null,
  matchesCount: 0,
  winMatches: [],
  lostMatches: [],
  score: 0,
  avgTests: 0,
  avgDuration: 0,
};

/**
 * return tournament matches statistics for player
 *
 * @typedef {{result: string, score: number, resultPercent: number, durationSec: number}} PlayerResult
 * @typedef {Object.<number, PlayerResult>} PlayerResults
 * @typedef {{playerIds: array, winnerId: number, playerResults: [PlayerResults]}} Match
 * @typedef {{
 *  playerId: {?number},
 *  matchesCount: number,
 *  winMatches: Match[],
 *  lostMatches: Match[],
 *  score: number,
 *  avgTests: number,
 *  avgDuration: number,
 * }} PlayerStatistics
 *
 * @param {number} playerId - player id
 * @param {Match[]} matches - list of matches per round
 * @return {[PlayerStatistics, PlayerStatistics]}
 *
 */
function useMatchesStatistics(playerId, matches) {
  return useMemo(() => {
    if (!matches || (matches.length === 0 && playerId)) {
      return [emptyStats, emptyStats];
    }

    const finishedMatches = matches.filter(
      match => !!match.playerResults[playerId],
    );
    const matchesCount = finishedMatches.length;

    const opponentId = matches[0].playerIds.find(id => id !== playerId);
    const playerWinMatches = matches.filter(
      match => playerId === match.winnerId,
    );
    const playerLostMatches = matches.filter(
      match => playerId !== match.winnerId
        && match.playerIds.some(id => id === playerId)
        && match.playerIds.some(id => id === match.winnerId),
    );
    const opponentWinMatches = matches.filter(
      match => opponentId === match.winnerId,
    );
    const opponentLostMatches = matches.filter(
      match => opponentId !== match.winnerId
        && match.playerIds.some(id => id === opponentId)
        && match.playerIds.some(id => id === match.winnerId),
    );

    const playerScore = sum(
      finishedMatches.map(match => match.playerResults[playerId]?.score || 0),
    );
    const opponentScore = sum(
      finishedMatches.map(
        match => match.playerResults[opponentId]?.score || 0,
      ),
    );

    const playerAvgTests = matchesCount !== 0
        ? sum(
            finishedMatches.map(
              match => match.playerResults[playerId]?.resultPercent || 0,
            ),
          ) / matchesCount
        : 0;
    const opponentAvgTests = matchesCount !== 0
        ? sum(
            finishedMatches.map(
              match => match.playerResults[opponentId]?.resultPercent || 0,
            ),
          ) / matchesCount
        : 0;

    const playerAvgDuration = finishedMatches.filter(match => match.winnerId === playerId) !== 0
        ? sum(
            finishedMatches.filter(match => match.winnerId === playerId).map(
              match => match?.durationSec || 0,
            ),
          ) / finishedMatches.filter(match => match.winnerId === playerId)
        : 0;
    const opponentAvgDuration = finishedMatches.filter(match => match.winnerId === opponentId) !== 0
        ? sum(
            finishedMatches.filter(match => match.winnerId === opponentId).map(
              match => match?.durationSec || 0,
            ),
          ) / finishedMatches.filter(match => match.winnerId === opponentId)
        : 0;

    const player = {
      playerId,
      matchesCount: matches.length,
      winMatches: playerWinMatches,
      lostMatches: playerLostMatches,
      score: playerScore,
      avgTests: playerAvgTests,
      avgDuration: playerAvgDuration,
    };
    const opponent = {
      playerId: opponentId,
      matchesCount: matches.length,
      winMatches: opponentWinMatches,
      lostMatches: opponentLostMatches,
      score: opponentScore,
      avgTests: opponentAvgTests,
      avgDuration: opponentAvgDuration,
    };

    return [player, opponent];
  }, [playerId, matches]);
}

export default useMatchesStatistics;
