"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Trophy,
  Play,
  Plus,
  Minus,
  Edit,
  Trash2,
  UserPlus,
  Camera,
  TrendingUp,
  Award,
  Users,
  Medal,
  CheckCircle,
} from "lucide-react";

// Participant interface and expanded initial data
interface Participant {
  id: number;
  name: string;
  photo: string;
  damaScore: number; // 다마수 (10-1000, increments of 10)
  threeCushion: number; // 쓰리큐 (1-30, increments of 1)
  victoryPoints: number; // 승점 (starts at 100, increments of 10)
}

interface GameState {
  inProgress: boolean;
  selectedParticipants: number[];
  startTime?: Date;
  rankings?: { participantId: number; rank: number }[];
}

// Sample participant data
const initialParticipants: Participant[] = [
  {
    id: 1,
    name: "김철수",
    photo: "/korean-man-billiards-player.png",
    damaScore: 150,
    threeCushion: 15,
    victoryPoints: 120,
  },
  {
    id: 2,
    name: "이영희",
    photo: "/korean-woman-billiards-player.png",
    damaScore: 180,
    threeCushion: 18,
    victoryPoints: 85,
  },
  {
    id: 3,
    name: "박민수",
    photo: "/korean-man-billiards-player-casual.png",
    damaScore: 120,
    threeCushion: 12,
    victoryPoints: 200,
  },
  {
    id: 4,
    name: "최지은",
    photo: "/korean-woman-billiards-player-professional.png",
    damaScore: 200,
    threeCushion: 20,
    victoryPoints: 150,
  },
];

export default function BilliardsApp() {
  const [participants, setParticipants] =
    useState<Participant[]>(initialParticipants);
  const [activeTab, setActiveTab] = useState("home");
  const [editingParticipant, setEditingParticipant] =
    useState<Participant | null>(null);
  const [isAddingParticipant, setIsAddingParticipant] = useState(false);
  const [newParticipant, setNewParticipant] = useState<Omit<Participant, "id">>(
    {
      name: "",
      photo: "",
      damaScore: 10,
      threeCushion: 1,
      victoryPoints: 100,
    }
  );

  const [gameState, setGameState] = useState<GameState>({
    inProgress: false,
    selectedParticipants: [],
  });
  const [isSelectingParticipants, setIsSelectingParticipants] = useState(false);
  const [tempSelectedParticipants, setTempSelectedParticipants] = useState<
    number[]
  >([]);
  const [isCompletingGame, setIsCompletingGame] = useState(false);
  const [gameRankings, setGameRankings] = useState<
    { participantId: number; rank: number }[]
  >([]);

  const [userProfile, setUserProfile] = useState<Participant>({
    id: 0,
    name: "내 프로필",
    photo: "/user-profile-billiards.png",
    damaScore: 150,
    threeCushion: 15,
    victoryPoints: 120,
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [promotionAmount, setPromotionAmount] = useState(10);
  const [showPromotionModal, setShowPromotionModal] = useState<{
    participantId: number;
    type: "promotion" | "demotion";
  } | null>(null);

  const startGameSetup = () => {
    setTempSelectedParticipants([]);
    setIsSelectingParticipants(true);
  };

  const toggleParticipantSelection = (participantId: number) => {
    setTempSelectedParticipants((prev) =>
      prev.includes(participantId)
        ? prev.filter((id) => id !== participantId)
        : [...prev, participantId]
    );
  };

  const confirmGameStart = () => {
    if (tempSelectedParticipants.length < 2) return;

    setGameState({
      inProgress: true,
      selectedParticipants: tempSelectedParticipants,
      startTime: new Date(),
    });
    setIsSelectingParticipants(false);
    setTempSelectedParticipants([]);
  };

  const startGameCompletion = () => {
    const initialRankings = gameState.selectedParticipants.map(
      (participantId, index) => ({
        participantId,
        rank: index + 1,
      })
    );
    setGameRankings(initialRankings);
    setIsCompletingGame(true);
  };

  const updateRanking = (participantId: number, newRank: number) => {
    setGameRankings((prev) =>
      prev.map((ranking) =>
        ranking.participantId === participantId
          ? { ...ranking, rank: newRank }
          : ranking
      )
    );
  };

  const calculateVictoryPoints = (rank: number, totalParticipants: number) => {
    if (totalParticipants === 1) return 0;

    // 1st place gets +35, last place gets -35
    const maxPoints = 35;
    const minPoints = -35;
    const pointRange = maxPoints - minPoints;

    // Calculate proportional points based on rank
    const pointsAwarded =
      maxPoints - ((rank - 1) / (totalParticipants - 1)) * pointRange;
    return Math.round(pointsAwarded);
  };

  const completeGame = () => {
    const totalParticipants = gameState.selectedParticipants.length;

    // Update victory points for all participants
    setParticipants((prev) =>
      prev.map((participant) => {
        const ranking = gameRankings.find(
          (r) => r.participantId === participant.id
        );
        if (ranking) {
          const pointsAwarded = calculateVictoryPoints(
            ranking.rank,
            totalParticipants
          );
          return {
            ...participant,
            victoryPoints: participant.victoryPoints + pointsAwarded,
          };
        }
        return participant;
      })
    );

    // Reset game state
    setGameState({
      inProgress: false,
      selectedParticipants: [],
    });
    setIsCompletingGame(false);
    setGameRankings([]);
  };

  const cancelGame = () => {
    setGameState({
      inProgress: false,
      selectedParticipants: [],
    });
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUserProfile({ ...userProfile, photo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateUserProfile = (updatedProfile: Participant) => {
    setUserProfile(updatedProfile);
    setIsEditingProfile(false);
  };

  const adjustUserScore = (field: keyof Participant, delta: number) => {
    const newValue = (userProfile[field] as number) + delta;
    let clampedValue = newValue;

    if (field === "damaScore") {
      clampedValue = Math.max(10, Math.min(1000, newValue));
    } else if (field === "threeCushion") {
      clampedValue = Math.max(1, Math.min(30, newValue));
    } else if (field === "victoryPoints") {
      clampedValue = newValue;
    }

    setUserProfile({ ...userProfile, [field]: clampedValue });
  };

  const addParticipant = () => {
    if (participants.length >= 6) return;
    const newId = Math.max(...participants.map((p) => p.id)) + 1;
    setParticipants([...participants, { ...newParticipant, id: newId }]);
    setNewParticipant({
      name: "",
      photo: "",
      damaScore: 10,
      threeCushion: 1,
      victoryPoints: 100,
    });
    setIsAddingParticipant(false);
  };

  const deleteParticipant = (id: number) => {
    setParticipants(participants.filter((p) => p.id !== id));
  };

  const updateParticipant = (updatedParticipant: Participant) => {
    setParticipants(
      participants.map((p) =>
        p.id === updatedParticipant.id ? updatedParticipant : p
      )
    );
    setEditingParticipant(null);
  };

  const adjustScore = (
    participantId: number,
    field: keyof Participant,
    delta: number
  ) => {
    setParticipants(
      participants.map((p) => {
        if (p.id !== participantId) return p;

        const newValue = (p[field] as number) + delta;
        let clampedValue = newValue;

        // Apply constraints based on field
        if (field === "damaScore") {
          clampedValue = Math.max(10, Math.min(1000, newValue));
        } else if (field === "threeCushion") {
          clampedValue = Math.max(1, Math.min(30, newValue));
        } else if (field === "victoryPoints") {
          clampedValue = newValue; // No limits for victory points
        }

        return { ...p, [field]: clampedValue };
      })
    );
  };

  const handlePromotion = (participantId: number, amount = 10) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === participantId
          ? {
              ...p,
              damaScore: Math.min(1000, p.damaScore + amount),
              victoryPoints: 100,
            }
          : p
      )
    );
  };

  const handleDemotion = (participantId: number, amount = 10) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === participantId
          ? {
              ...p,
              damaScore: Math.max(10, p.damaScore - amount),
              victoryPoints: 100,
            }
          : p
      )
    );
  };

  const openPromotionModal = (
    participantId: number,
    type: "promotion" | "demotion"
  ) => {
    setShowPromotionModal({ participantId, type });
    setPromotionAmount(10);
  };

  const confirmPromotionDemotion = () => {
    if (!showPromotionModal) return;

    if (showPromotionModal.type === "promotion") {
      handlePromotion(showPromotionModal.participantId, promotionAmount);
    } else {
      handleDemotion(showPromotionModal.participantId, promotionAmount);
    }

    setShowPromotionModal(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content Area */}
      <div className="flex-1 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="home" className="mt-0">
            <div className="relative min-h-screen">
              {/* Background with billiards theme */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5"
                style={{
                  backgroundImage: `url('/4-ball-billiards-table-green-felt-background.png')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: 0.1,
                }}
              />

              {/* Participants List */}
              <div className="relative z-10 p-4">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    {/* <h1 className="text-2xl font-bold text-foreground mb-2">4구 당구 레이팅</h1> */}
                    <p className="text-muted-foreground">
                      참여자 목록 ({participants.length}/6)
                    </p>
                  </div>
                  {participants.length < 6 && (
                    <Dialog
                      open={isAddingParticipant}
                      onOpenChange={setIsAddingParticipant}
                    >
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <UserPlus className="h-4 w-4 mr-2" />
                          참여자 추가
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>새 참여자 추가</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name">이름</Label>
                            <Input
                              id="name"
                              value={newParticipant.name}
                              onChange={(e) =>
                                setNewParticipant({
                                  ...newParticipant,
                                  name: e.target.value,
                                })
                              }
                              placeholder="참여자 이름"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>다마수</Label>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setNewParticipant({
                                      ...newParticipant,
                                      damaScore: Math.max(
                                        10,
                                        newParticipant.damaScore - 10
                                      ),
                                    })
                                  }
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-12 text-center">
                                  {newParticipant.damaScore}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setNewParticipant({
                                      ...newParticipant,
                                      damaScore: Math.min(
                                        1000,
                                        newParticipant.damaScore + 10
                                      ),
                                    })
                                  }
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div>
                              <Label>쓰리큐</Label>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setNewParticipant({
                                      ...newParticipant,
                                      threeCushion: Math.max(
                                        1,
                                        newParticipant.threeCushion - 1
                                      ),
                                    })
                                  }
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-12 text-center">
                                  {newParticipant.threeCushion}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setNewParticipant({
                                      ...newParticipant,
                                      threeCushion: Math.min(
                                        30,
                                        newParticipant.threeCushion + 1
                                      ),
                                    })
                                  }
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsAddingParticipant(false)}
                            >
                              취소
                            </Button>
                            <Button
                              onClick={addParticipant}
                              disabled={!newParticipant.name.trim()}
                            >
                              추가
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                <div className="space-y-3">
                  {participants.map((p) => (
                    <Card
                      key={p.id}
                      className="bg-card/90 backdrop-blur-sm border-border/50"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={p.photo || "/placeholder.svg"}
                              alt={p.name}
                            />
                            <AvatarFallback>{p.name[0]}</AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <h3 className="font-semibold text-card-foreground">
                              {p.name}
                            </h3>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                다마수: {p.damaScore}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                쓰리큐: {p.threeCushion}
                              </Badge>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm font-medium text-card-foreground">
                              승점: {p.victoryPoints}
                            </div>
                            <div className="flex gap-1 mt-1">
                              {p.victoryPoints > 200 && (
                                <button
                                  onClick={() =>
                                    openPromotionModal(p.id, "promotion")
                                  }
                                  className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                                >
                                  승급 가능
                                </button>
                              )}
                              {p.victoryPoints < 0 && (
                                <button
                                  onClick={() =>
                                    openPromotionModal(p.id, "demotion")
                                  }
                                  className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                                >
                                  강등 위험
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingParticipant(p)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>{p.name} 편집</DialogTitle>
                                </DialogHeader>
                                {editingParticipant && (
                                  <div className="space-y-4">
                                    <div>
                                      <Label>이름</Label>
                                      <Input
                                        value={editingParticipant.name}
                                        onChange={(e) =>
                                          setEditingParticipant({
                                            ...editingParticipant,
                                            name: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label>다마수</Label>
                                        <div className="flex items-center gap-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              setEditingParticipant({
                                                ...editingParticipant,
                                                damaScore: Math.max(
                                                  10,
                                                  editingParticipant.damaScore -
                                                    10
                                                ),
                                              })
                                            }
                                          >
                                            <Minus className="h-3 w-3" />
                                          </Button>
                                          <span className="w-12 text-center">
                                            {editingParticipant.damaScore}
                                          </span>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              setEditingParticipant({
                                                ...editingParticipant,
                                                damaScore: Math.min(
                                                  1000,
                                                  editingParticipant.damaScore +
                                                    10
                                                ),
                                              })
                                            }
                                          >
                                            <Plus className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </div>
                                      <div>
                                        <Label>쓰리큐</Label>
                                        <div className="flex items-center gap-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              setEditingParticipant({
                                                ...editingParticipant,
                                                threeCushion: Math.max(
                                                  1,
                                                  editingParticipant.threeCushion -
                                                    1
                                                ),
                                              })
                                            }
                                          >
                                            <Minus className="h-3 w-3" />
                                          </Button>
                                          <span className="w-12 text-center">
                                            {editingParticipant.threeCushion}
                                          </span>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              setEditingParticipant({
                                                ...editingParticipant,
                                                threeCushion: Math.min(
                                                  30,
                                                  editingParticipant.threeCushion +
                                                    1
                                                ),
                                              })
                                            }
                                          >
                                            <Plus className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <Label>승점</Label>
                                      <div className="flex items-center gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                            setEditingParticipant({
                                              ...editingParticipant,
                                              victoryPoints:
                                                editingParticipant.victoryPoints -
                                                10,
                                            })
                                          }
                                        >
                                          <Minus className="h-3 w-3" />
                                        </Button>
                                        <span className="w-16 text-center">
                                          {editingParticipant.victoryPoints}
                                        </span>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                            setEditingParticipant({
                                              ...editingParticipant,
                                              victoryPoints:
                                                editingParticipant.victoryPoints +
                                                10,
                                            })
                                          }
                                        >
                                          <Plus className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        onClick={() =>
                                          setEditingParticipant(null)
                                        }
                                      >
                                        취소
                                      </Button>
                                      <Button
                                        onClick={() =>
                                          updateParticipant(editingParticipant)
                                        }
                                      >
                                        저장
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteParticipant(p.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="my" className="mt-0 p-4">
            <div className="space-y-4">
              {/* Profile Header */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />내 프로필
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="relative">
                      <Avatar className="h-24 w-24 mx-auto">
                        <AvatarImage
                          src={userProfile.photo || "/placeholder.svg"}
                          alt={userProfile.name}
                        />
                        <AvatarFallback>나</AvatarFallback>
                      </Avatar>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-transparent"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="h-3 w-3 mr-1" />
                        사진 변경
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold">
                        {userProfile.name}
                      </h3>
                      <div className="flex justify-center gap-2 mt-2">
                        {userProfile.victoryPoints > 200 && (
                          <button
                            onClick={() => openPromotionModal(0, "promotion")}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            승급 가능
                          </button>
                        )}
                        {userProfile.victoryPoints < 0 && (
                          <button
                            onClick={() => openPromotionModal(0, "demotion")}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            강등 위험
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Score Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center space-y-2">
                      <div className="text-2xl font-bold text-primary">
                        {userProfile.damaScore}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        다마수
                      </div>
                      <div className="flex justify-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => adjustUserScore("damaScore", -10)}
                          disabled={userProfile.damaScore <= 10}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => adjustUserScore("damaScore", 10)}
                          disabled={userProfile.damaScore >= 1000}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center space-y-2">
                      <div className="text-2xl font-bold text-accent">
                        {userProfile.threeCushion}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        쓰리큐
                      </div>
                      <div className="flex justify-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => adjustUserScore("threeCushion", -1)}
                          disabled={userProfile.threeCushion <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => adjustUserScore("threeCushion", 1)}
                          disabled={userProfile.threeCushion >= 30}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Victory Points Card */}
              <Card>
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-foreground">
                      {userProfile.victoryPoints}
                    </div>
                    <div className="text-sm text-muted-foreground">승점</div>
                    <div className="flex justify-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => adjustUserScore("victoryPoints", -10)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => adjustUserScore("victoryPoints", 10)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Score Adjustment Actions */}
              <div className="space-y-3">
                {userProfile.victoryPoints > 200 && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full" variant="default">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        다마수 올리기 (승급)
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>다마수 승급</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          승점이 200점을 넘어 다마수를 올릴 수 있습니다. 올릴
                          다마수를 입력하세요.
                        </p>
                        <div>
                          <Label>올릴 다마수 (10점 단위)</Label>
                          <Input
                            type="number"
                            min="10"
                            max="100"
                            step="10"
                            defaultValue="10"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1 bg-transparent"
                          >
                            취소
                          </Button>
                          <Button
                            className="flex-1"
                            onClick={() => {
                              setUserProfile({
                                ...userProfile,
                                damaScore: Math.min(
                                  1000,
                                  userProfile.damaScore + 10
                                ),
                                victoryPoints: 100,
                              });
                            }}
                          >
                            확인
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {userProfile.victoryPoints < 0 && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full" variant="destructive">
                        <Award className="h-4 w-4 mr-2" />
                        다마수 내리기 (강등)
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>다마수 강등</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          승점이 0점 미만으로 다마수를 내려야 합니다. 내릴
                          다마수를 입력하세요.
                        </p>
                        <div>
                          <Label>내릴 다마수 (10점 단위)</Label>
                          <Input
                            type="number"
                            min="10"
                            max="50"
                            step="10"
                            defaultValue="10"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1 bg-transparent"
                          >
                            취소
                          </Button>
                          <Button
                            variant="destructive"
                            className="flex-1"
                            onClick={() => {
                              setUserProfile({
                                ...userProfile,
                                damaScore: Math.max(
                                  10,
                                  userProfile.damaScore - 10
                                ),
                                victoryPoints: 100,
                              });
                            }}
                          >
                            확인
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {/* Profile Edit */}
              <Dialog
                open={isEditingProfile}
                onOpenChange={setIsEditingProfile}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Edit className="h-4 w-4 mr-2" />
                    프로필 편집
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>프로필 편집</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>이름</Label>
                      <Input
                        value={userProfile.name}
                        onChange={(e) =>
                          setUserProfile({
                            ...userProfile,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditingProfile(false)}
                      >
                        취소
                      </Button>
                      <Button onClick={() => updateUserProfile(userProfile)}>
                        저장
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>

          <TabsContent value="game" className="mt-0 p-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  게임 관리
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!gameState.inProgress ? (
                  <div className="space-y-4">
                    <Button className="w-full h-12" onClick={startGameSetup}>
                      <Play className="h-4 w-4 mr-2" />
                      게임 시작
                    </Button>

                    {/* Participant Selection Dialog */}
                    <Dialog
                      open={isSelectingParticipants}
                      onOpenChange={setIsSelectingParticipants}
                    >
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            참여자 선택
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            게임에 참여할 선수들을 선택하세요 (최소 2명)
                          </p>
                          <div className="space-y-3 max-h-60 overflow-y-auto">
                            {participants.map((participant) => (
                              <div
                                key={participant.id}
                                className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                              >
                                <div className="relative">
                                  <Checkbox
                                    id={`participant-${participant.id}`}
                                    checked={tempSelectedParticipants.includes(
                                      participant.id
                                    )}
                                    onCheckedChange={() =>
                                      toggleParticipantSelection(participant.id)
                                    }
                                    className="h-5 w-5 border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                  />
                                </div>
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={
                                      participant.photo || "/placeholder.svg"
                                    }
                                    alt={participant.name}
                                  />
                                  <AvatarFallback>
                                    {participant.name[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">
                                    {participant.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    다마수: {participant.damaScore} | 승점:{" "}
                                    {participant.victoryPoints}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsSelectingParticipants(false)}
                            >
                              취소
                            </Button>
                            <Button
                              onClick={confirmGameStart}
                              disabled={tempSelectedParticipants.length < 2}
                            >
                              게임 시작 ({tempSelectedParticipants.length}명)
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <div className="text-lg font-semibold text-primary">
                        게임 진행 중
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {gameState.selectedParticipants.length}명이 게임을
                        진행하고 있습니다
                      </div>
                    </div>

                    {/* Current Game Participants */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">
                          참여 중인 선수
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {gameState.selectedParticipants.map(
                            (participantId) => {
                              const participant = participants.find(
                                (p) => p.id === participantId
                              );
                              if (!participant) return null;
                              return (
                                <div
                                  key={participantId}
                                  className="flex items-center gap-3"
                                >
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={
                                        participant.photo || "/placeholder.svg"
                                      }
                                      alt={participant.name}
                                    />
                                    <AvatarFallback>
                                      {participant.name[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">
                                      {participant.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      다마수: {participant.damaScore}
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={cancelGame}
                        className="flex-1 bg-transparent"
                      >
                        게임 취소
                      </Button>
                      <Button onClick={startGameCompletion} className="flex-1">
                        <Medal className="h-4 w-4 mr-2" />
                        게임 완료
                      </Button>
                    </div>

                    {/* Game Completion Dialog */}
                    <Dialog
                      open={isCompletingGame}
                      onOpenChange={setIsCompletingGame}
                    >
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5" />
                            게임 결과 입력
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            각 참여자의 순위를 설정하세요
                          </p>
                          <div className="space-y-3">
                            {gameRankings.map((ranking) => {
                              const participant = participants.find(
                                (p) => p.id === ranking.participantId
                              );
                              if (!participant) return null;

                              const pointsAwarded = calculateVictoryPoints(
                                ranking.rank,
                                gameState.selectedParticipants.length
                              );

                              return (
                                <div
                                  key={ranking.participantId}
                                  className="flex items-center gap-3"
                                >
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={
                                        participant.photo || "/placeholder.svg"
                                      }
                                      alt={participant.name}
                                    />
                                    <AvatarFallback>
                                      {participant.name[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">
                                      {participant.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      승점 변화: {pointsAwarded > 0 ? "+" : ""}
                                      {pointsAwarded}
                                    </div>
                                  </div>
                                  <Select
                                    value={ranking.rank.toString()}
                                    onValueChange={(value) =>
                                      updateRanking(
                                        ranking.participantId,
                                        Number.parseInt(value)
                                      )
                                    }
                                  >
                                    <SelectTrigger className="w-20">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Array.from(
                                        {
                                          length:
                                            gameState.selectedParticipants
                                              .length,
                                        },
                                        (_, i) => (
                                          <SelectItem
                                            key={i + 1}
                                            value={(i + 1).toString()}
                                          >
                                            {i + 1}등
                                          </SelectItem>
                                        )
                                      )}
                                    </SelectContent>
                                  </Select>
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsCompletingGame(false)}
                            >
                              취소
                            </Button>
                            <Button onClick={completeGame}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              완료
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 h-16 bg-transparent">
            <TabsTrigger
              value="home"
              className="flex flex-col gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Trophy className="h-4 w-4" />
              <span className="text-xs">홈</span>
            </TabsTrigger>
            <TabsTrigger
              value="my"
              className="flex flex-col gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <User className="h-4 w-4" />
              <span className="text-xs">MY</span>
            </TabsTrigger>
            <TabsTrigger
              value="game"
              className="flex flex-col gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Play className="h-4 w-4" />
              <span className="text-xs">게임 시작</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {showPromotionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">
              {showPromotionModal.type === "promotion" ? "승급" : "강등"} 점수
              선택
            </h3>
            <p className="text-gray-600 mb-4">
              다마수를 얼마나{" "}
              {showPromotionModal.type === "promotion" ? "올릴" : "내릴"}까요?
            </p>

            <div className="grid grid-cols-5 gap-2 mb-4">
              {[10, 20, 30, 40, 50].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setPromotionAmount(amount)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    promotionAmount === amount
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {amount}
                </button>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                직접 입력 (10-100)
              </label>
              <input
                type="number"
                min="10"
                max="100"
                step="10"
                value={promotionAmount}
                onChange={(e) =>
                  setPromotionAmount(
                    Math.max(
                      10,
                      Math.min(100, Number.parseInt(e.target.value) || 10)
                    )
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPromotionModal(null)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                취소
              </button>
              <button
                onClick={confirmPromotionDemotion}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                  showPromotionModal.type === "promotion"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
