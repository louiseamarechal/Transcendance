import { ForbiddenException, Injectable } from '@nestjs/common';
import { FriendRequest } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditFriendRequestDto } from './dto';

@Injectable()
export class FriendRequestService {
  constructor(private prisma: PrismaService) {}

  async createFR(fromId: number, toId: number): Promise<FriendRequest> {
    const friendRequest = await this.prisma.friendRequest.create({
      data: {
        fromId,
        toId,
      },
    });
    return friendRequest;
  }

  getFRs(fromId: number) {
    return this.prisma.friendRequest.findMany({
      where: {
        fromId,
      },
    });
  }

	getFRById(fromId: number, friendRequestId: number) {
		return this.prisma.friendRequest.findMany({
      where: {
				id: friendRequestId,
        fromId,
      },
    });
	}

	getFRByToId(fromId: number, toId: number) {
		return this.prisma.friendRequest.findMany({
      where: {
        fromId,
				toId,
      },
    });
	}

	async editFRById(fromId: number, friendRequestId: number, dto: EditFriendRequestDto) {
		const friendRequest = await this.prisma.friendRequest.findUnique({
			where: {
				id: friendRequestId,
			},
		});

		// Check ownership
		if (!friendRequest || friendRequest.fromId != fromId)
			throw new ForbiddenException('Access to ressource denied');
		
			return this.prisma.friendRequest.update({
				where: {
					id: friendRequestId,
				},
				data: {
					...dto,
				},
			});
	}

	async editFRByToId(fromId: number, toId: number, dto: EditFriendRequestDto) {
		const friendRequest = await this.prisma.friendRequest.findUnique({
			where: {
				fromId_toId: {
					fromId,
					toId,
				}
			},
		});

		// Check ownership
		if (!friendRequest)
			throw new ForbiddenException('Access to ressource denied');
		
			return this.prisma.friendRequest.update({
				where: {
					fromId_toId: {
						fromId,
						toId,
					},
				},
				data: {
					...dto,
				},
			});
	}

	async deleteFRById(fromId: number, friendRequestId: number) {
		const friendRequest = await this.prisma.friendRequest.findUnique({
			where: {
				id: friendRequestId,
			},
		});

		// Check ownership
		if (!friendRequest || friendRequest.fromId != fromId)
			throw new ForbiddenException('Access to ressource denied');
		
			this.prisma.friendRequest.delete({
				where: {
					id: friendRequestId,
				},
			});
	}

	async deleteFRByToId(fromId: number, toId: number) {
		const friendRequest = await this.prisma.friendRequest.findUnique({
			where: {
				fromId_toId: {
					fromId,
					toId,
				}
			},
		});

		// Check ownership
		if (!friendRequest)
			throw new ForbiddenException('Access to ressource denied');
		
			this.prisma.friendRequest.delete({
				where: {
					fromId_toId: {
						fromId,
						toId,
					},
				},
			});
	}
}
