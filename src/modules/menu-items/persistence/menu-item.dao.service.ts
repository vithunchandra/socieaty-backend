import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { MenuItemEntity } from "./menu-item.entity";
import { EntityRepository } from "@mikro-orm/postgresql";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";

@Injectable()
export class MenuItemDaoService {
	constructor(
		@InjectRepository(MenuItemEntity)
		private readonly menuItemRepository: EntityRepository<MenuItemEntity>
	) {}

    createFoodOrderMenuItem(dto: CreateMenuItemDto): MenuItemEntity {
		const menuItem = this.menuItemRepository.create({
			foodOrder: dto.foodOrder,
			reservation: dto.reservation,
			menu: dto.menu,
			quantity: dto.quantity,
			price: dto.menu.price,
			totalPrice: dto.menu.price * dto.quantity
		})

		return menuItem
	}

	async findFoodOrderMenuItemsByOrderId(id: string): Promise<MenuItemEntity[]> {
		return await this.menuItemRepository.find(
			{ foodOrder: { id } },
			{ populate: ['menu.categories'] }
		)
	}

	async findReservationMenuItemsByReservationId(id: string): Promise<MenuItemEntity[]> {
		return await this.menuItemRepository.find(
			{ reservation: { id } },
			{ populate: ['menu.categories'] }
		)
	}
}

