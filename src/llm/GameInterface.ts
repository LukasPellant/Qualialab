import useSandboxStore from '../stores/useSandboxStore';
import useResourceStore from '../stores/useResourceStore';
import usePopulationStore from '../stores/usePopulationStore';
import useMarketStore from '../stores/useMarketStore';
import useLogStore from '../stores/useLogStore';
import { getBuildingConfig, getUpgradeConfig } from '../data/buildingData';

export class GameInterface {
    static getGameStateDescription(): string {
        const resources = useResourceStore.getState();
        const population = usePopulationStore.getState();
        const sandbox = useSandboxStore.getState();
        const market = useMarketStore.getState();

        const buildingsSummary = sandbox.objects
            .filter(obj => obj.type !== 'worker' && obj.type !== 'mountain')
            .map(obj => {
                let summary = `${obj.type} (ID: ${obj.id})`;
                if (obj.assignedWorkers) {
                    summary += `, Workers: ${obj.assignedWorkers.length}/${obj.workerCapacity || 0}`;
                }
                if (obj.upgrades && obj.upgrades.length > 0) {
                    summary += `, Upgrades: [${obj.upgrades.join(', ')}]`;
                }
                return summary;
            })
            .join('\n- ');

        const totalPopulation = sandbox.objects.filter(obj => obj.type === 'worker').length;

        return `
Current Game State:
Resources:
- Wood: ${Math.floor(resources.wood)}
- Stone: ${Math.floor(resources.stone)}
- Food: ${Math.floor(resources.food)}
- Gold: ${Math.floor(resources.gold)}

Population:
- Total: ${totalPopulation} / ${population.cap}
- Idle: ${population.idle}

Market Prices:
- Wood: ${market.prices.wood.toFixed(2)}
- Stone: ${market.prices.stone.toFixed(2)}
- Food: ${market.prices.food.toFixed(2)}

Buildings:
- ${buildingsSummary || 'None'}
    `.trim();
    }

    static executeCommand(action: string, params: any = {}): { success: boolean; message: string } {
        const log = useLogStore.getState().addLog;

        try {
            switch (action.toLowerCase()) {
                case 'build':
                    return this.handleBuild(params);
                case 'upgrade':
                    return this.handleUpgrade(params);
                case 'assign':
                    return this.handleAssign(params);
                case 'unassign':
                    return this.handleUnassign(params);
                case 'buy':
                    return this.handleBuy(params);
                case 'sell':
                    return this.handleSell(params);
                default:
                    return { success: false, message: `Unknown command: ${action}` };
            }
        } catch (error: any) {
            log(`Error executing ${action}: ${error.message}`, 'error');
            return { success: false, message: error.message };
        }
    }

    private static handleBuild(params: { type: string; x: number; z: number }): { success: boolean; message: string } {
        const { type, x, z } = params;
        if (!type || x === undefined || z === undefined) {
            return { success: false, message: 'Missing parameters: type, x, z' };
        }

        const config = getBuildingConfig(type);
        if (!config) {
            return { success: false, message: `Invalid building type: ${type}` };
        }

        const resources = useResourceStore.getState();
        const cost = config.cost;

        // Check cost
        if ((cost.wood || 0) > resources.wood ||
            (cost.stone || 0) > resources.stone ||
            (cost.food || 0) > resources.food ||
            (cost.gold || 0) > resources.gold) {
            return { success: false, message: 'Insufficient resources' };
        }

        // Deduct resources
        resources.addResources({
            wood: -(cost.wood || 0),
            stone: -(cost.stone || 0),
            food: -(cost.food || 0),
            gold: -(cost.gold || 0),
        });

        // Add building
        const id = `${type}_${Date.now()}`;
        useSandboxStore.getState().addObject({
            id,
            type: type as any,
            position: [x, 0, z],
            workerCapacity: config.jobs,
            assignedWorkers: [],
            jobs: { max: config.jobs, assigned: 0 },
            storage: config.storage ? { [config.base.resource || 'wood']: 0 } : undefined,
            storageMax: config.storage ? { [config.base.resource || 'wood']: config.storage } : undefined,
            upgrades: []
        });

        useLogStore.getState().addLog(`Built ${type} at (${x}, ${z})`, 'success');
        return { success: true, message: `Built ${type} at (${x}, ${z})` };
    }

    private static handleUpgrade(params: { buildingId: string; upgradeId: string }): { success: boolean; message: string } {
        const { buildingId, upgradeId } = params;
        const sandbox = useSandboxStore.getState();
        const building = sandbox.objects.find(obj => obj.id === buildingId);

        if (!building) return { success: false, message: 'Building not found' };

        const upgrade = getUpgradeConfig(upgradeId);
        if (!upgrade) return { success: false, message: 'Invalid upgrade ID' };

        if (building.upgrades?.includes(upgradeId)) {
            return { success: false, message: 'Upgrade already exists' };
        }

        const resources = useResourceStore.getState();
        const cost = upgrade.cost;

        if ((cost.wood || 0) > resources.wood ||
            (cost.stone || 0) > resources.stone ||
            (cost.food || 0) > resources.food ||
            (cost.gold || 0) > resources.gold) {
            return { success: false, message: 'Insufficient resources' };
        }

        resources.addResources({
            wood: -(cost.wood || 0),
            stone: -(cost.stone || 0),
            food: -(cost.food || 0),
            gold: -(cost.gold || 0),
        });

        sandbox.addUpgradeToBuilding(buildingId, upgradeId);
        useLogStore.getState().addLog(`Upgraded ${buildingId} with ${upgrade.name}`, 'success');
        return { success: true, message: `Upgraded ${buildingId} with ${upgrade.name}` };
    }

    private static handleAssign(params: { buildingId: string }): { success: boolean; message: string } {
        const { buildingId } = params;
        const sandbox = useSandboxStore.getState();
        const building = sandbox.objects.find(obj => obj.id === buildingId);

        if (!building) return { success: false, message: 'Building not found' };
        if (!building.workerCapacity) return { success: false, message: 'Building cannot accept workers' };
        if ((building.assignedWorkers?.length || 0) >= building.workerCapacity) {
            return { success: false, message: 'Building is full' };
        }

        const idleWorker = sandbox.objects.find(obj => obj.type === 'worker' && obj.state === 'idle');
        if (!idleWorker) return { success: false, message: 'No idle workers available' };

        // Logic to assign worker (similar to BuildingPanel)
        sandbox.setObjects(prev => {
            const next = prev.map(o => ({ ...o }));
            const b = next.find(o => o.id === buildingId)!;
            const w = next.find(o => o.id === idleWorker.id)!;

            w.assignedTargetId = b.id;
            b.assignedWorkers = [...(b.assignedWorkers || []), w.id];
            const res = b.type === 'mine' ? 'stone' : b.type === 'forest' ? 'wood' : 'food';
            w.task = { type: 'gather', resource: res as any, targetId: b.id } as any;
            w.state = 'moving';

            return next;
        });

        useLogStore.getState().addLog(`Assigned worker to ${buildingId}`, 'success');
        return { success: true, message: `Assigned worker to ${buildingId}` };
    }

    private static handleUnassign(params: { buildingId: string }): { success: boolean; message: string } {
        const { buildingId } = params;
        const sandbox = useSandboxStore.getState();
        const building = sandbox.objects.find(obj => obj.id === buildingId);

        if (!building) return { success: false, message: 'Building not found' };
        if (!building.assignedWorkers || building.assignedWorkers.length === 0) {
            return { success: false, message: 'No workers assigned' };
        }

        sandbox.setObjects(prev => {
            const next = prev.map(o => ({ ...o }));
            const b = next.find(o => o.id === buildingId)!;
            const workerId = b.assignedWorkers![b.assignedWorkers!.length - 1];
            const w = next.find(o => o.id === workerId);

            if (w) {
                w.assignedTargetId = null;
                w.task = null;
                w.state = 'idle';
            }
            b.assignedWorkers = b.assignedWorkers!.slice(0, -1);

            return next;
        });

        useLogStore.getState().addLog(`Unassigned worker from ${buildingId}`, 'success');
        return { success: true, message: `Unassigned worker from ${buildingId}` };
    }

    private static handleBuy(params: { resource: 'wood' | 'stone' | 'food'; amount: number }): { success: boolean; message: string } {
        const { resource, amount } = params;
        const market = useMarketStore.getState();
        const resources = useResourceStore.getState();

        const cost = market.prices[resource] * amount;
        if (resources.gold < cost) {
            return { success: false, message: `Insufficient gold. Cost: ${cost.toFixed(1)}` };
        }

        resources.addResources({ gold: -cost, [resource]: amount });
        market.buyResource(resource, amount);

        useLogStore.getState().addLog(`Bought ${amount} ${resource} for ${cost.toFixed(1)} Gold`, 'success');
        return { success: true, message: `Bought ${amount} ${resource} for ${cost.toFixed(1)} Gold` };
    }

    private static handleSell(params: { resource: 'wood' | 'stone' | 'food'; amount: number }): { success: boolean; message: string } {
        const { resource, amount } = params;
        const market = useMarketStore.getState();
        const resources = useResourceStore.getState();

        if ((resources[resource] || 0) < amount) {
            return { success: false, message: `Insufficient ${resource}` };
        }

        const revenue = market.prices[resource] * amount;
        resources.addResources({ gold: revenue, [resource]: -amount });
        market.sellResource(resource, amount);

        useLogStore.getState().addLog(`Sold ${amount} ${resource} for ${revenue.toFixed(1)} Gold`, 'success');
        return { success: true, message: `Sold ${amount} ${resource} for ${revenue.toFixed(1)} Gold` };
    }
}
