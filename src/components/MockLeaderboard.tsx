import React from 'react';
import { Trophy, Flame, Sparkles, Award } from 'lucide-react';

interface LeaderboardUser {
  rank: number;
  name: string;
  points: number;
  streak: number;
  currentCohort: string;
}

const leaderboardData: LeaderboardUser[] = [
  { rank: 1, name: 'Ananya Sharma', points: 1240, streak: 18, currentCohort: 'Semester 4 - A' },
  { rank: 2, name: 'Rohan Gupta', points: 1180, streak: 12, currentCohort: 'Semester 4 - B' },
  { rank: 3, name: 'Vikram Malhotra', points: 1050, streak: 15, currentCohort: 'Semester 2 - A' },
  { rank: 4, name: 'Arjun Das', points: 980, streak: 8, currentCohort: 'Semester 4 - A' },
  { rank: 5, name: 'John Doe (You)', points: 840, streak: 12, currentCohort: 'Semester 4 - B' },
  { rank: 6, name: 'Sneha Patel', points: 810, streak: 5, currentCohort: 'Semester 2 - B' },
  { rank: 7, name: 'Priya Verma', points: 790, streak: 6, currentCohort: 'Semester 4 - B' },
];

export default function MockLeaderboard() {
  const maxPoints = leaderboardData[0].points;

  return (
    <div id="leaderboard-module" className="bg-white rounded-3xl border border-slate-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] text-left">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-950">Academic Standings</h3>
            <p className="text-[11px] text-slate-400">Streak rankings for current MCA batches</p>
          </div>
        </div>
        <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-lg">
          COHORT S4-B
        </span>
      </div>

      <div className="space-y-2.5">
        {leaderboardData.map((user) => {
          const isCurrentUser = user.name.includes('(You)');
          const progressPercent = Math.min(100, Math.max(10, (user.points / maxPoints) * 100));

          // Medal configurations
          const getRankStyle = (rank: number) => {
            switch (rank) {
              case 1:
                return { bg: 'bg-amber-100 border border-amber-200 text-amber-800 shadow-sm', badge: '🥇' };
              case 2:
                return { bg: 'bg-slate-100 border border-slate-200 text-slate-800', badge: '🥈' };
              case 3:
                return { bg: 'bg-orange-100 border border-orange-200 text-orange-850', badge: '🥉' };
              default:
                return { bg: 'bg-slate-50 border border-slate-100 text-slate-500', badge: `#${rank}` };
            }
          };

          const rankStyle = getRankStyle(user.rank);

          return (
            <div
              key={user.rank}
              className={`group relative flex flex-col justify-between p-3.5 rounded-2xl border transition-all duration-300 ${
                isCurrentUser
                  ? 'bg-indigo-50/50 border-indigo-200 shadow-sm relative overflow-hidden'
                  : 'bg-slate-50/20 hover:bg-slate-50/70 border-slate-100'
              }`}
            >
              {isCurrentUser && (
                <div className="absolute right-0 top-0 translate-x-2 -translate-y-2 w-16 h-16 bg-indigo-100/30 rounded-full blur-xl pointer-events-none"></div>
              )}
              
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  {/* Avatar / Rank badge style */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold leading-none ${rankStyle.bg}`}>
                    {rankStyle.badge}
                  </div>
                  
                  <div>
                    <h4 className={`text-xs font-bold leading-none flex items-center gap-1.5 ${isCurrentUser ? 'text-indigo-950 font-extrabold' : 'text-slate-800'}`}>
                      {user.name}
                      {isCurrentUser && (
                        <span className="text-[8px] bg-indigo-600 text-white font-mono px-1.5 py-0.2 rounded-md uppercase font-semibold">
                          Active
                        </span>
                      )}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono tracking-tight">{user.currentCohort}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Streak value badge */}
                  <div className="flex items-center gap-1 bg-white border border-slate-100 px-2 py-0.5 rounded-lg shadow-2xs" title="Streak Days">
                    <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-400" />
                    <span className="text-[10px] font-bold text-slate-700 font-mono">
                      {user.streak}d
                    </span>
                  </div>
                  
                  <div className="text-right min-w-[50px]">
                    <span className="text-xs font-extrabold text-slate-900 block leading-tight font-mono">
                      {user.points}
                    </span>
                    <span className="text-[8px] text-slate-400 block uppercase font-semibold tracking-wider leading-none">pts</span>
                  </div>
                </div>
              </div>

              {/* Progress Relative Indicator Bar in backgrounds */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3.5">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${isCurrentUser ? 'bg-indigo-600' : 'bg-slate-350'}`}
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
