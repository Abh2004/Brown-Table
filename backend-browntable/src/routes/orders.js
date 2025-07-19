const express = require("express");
const Order = require("../models/Order");
const Group = require("../models/Group");
const generateId = require("../utils/generateId");

const router = express.Router();

// POST /api/orders/:groupId/update-order - Update group order
router.post("/:groupId/update-order", async (req, res) => {
  try {
    const { groupId } = req.params;
    const { items, userId } = req.body;

    // Validation
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "Items array is required",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Check if group exists
    const group = await Group.findOne({ id: groupId });
    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // Check if user is a member of the group
    const isMember = group.groupMembers.some(
      (member) => member.userId === userId
    );
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "User is not a member of this group",
      });
    }

    // Find existing order or create new one
    let order = await Order.findOne({ groupId }).sort({ createdAt: -1 });

    if (!order) {
      order = new Order({
        id: generateId(),
        groupId,
        items: [],
        totalAmount: 0,
        orderBy: userId,
      });
    }

    // Remove existing items from this user
    order.items = order.items.filter((item) => item.addedBy !== userId);

    // Add new items from this user
    const userItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      type: item.type,
      addedBy: userId,
      specialInstructions: item.specialInstructions || "",
      addedAt: new Date(),
    }));

    order.items.push(...userItems);

    // Save order (pre-save middleware will calculate totals)
    await order.save();

    res.json({
      success: true,
      message: "Order updated successfully",
      data: {
        order: {
          id: order.id,
          groupId: order.groupId,
          items: order.items,
          totalAmount: order.totalAmount,
          serviceCharge: order.serviceCharge,
          tax: order.tax,
          finalAmount: order.finalAmount,
          status: order.status,
        },
      },
    });
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message,
    });
  }
});

// GET /api/orders/:groupId - Get group order
router.get("/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;

    const order = await Order.findOne({ groupId }).sort({ createdAt: -1 });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No order found for this group",
      });
    }

    // Get group details
    const group = await Group.findOne({ id: groupId });

    // Group items by member
    const itemsByMember = {};
    if (group) {
      group.groupMembers.forEach((member) => {
        itemsByMember[member.userId] = {
          member,
          items: order.items.filter((item) => item.addedBy === member.userId),
        };
      });
    }

    res.json({
      success: true,
      data: {
        order: {
          id: order.id,
          groupId: order.groupId,
          items: order.items,
          totalAmount: order.totalAmount,
          serviceCharge: order.serviceCharge,
          tax: order.tax,
          discount: order.discount,
          finalAmount: order.finalAmount,
          status: order.status,
          paymentStatus: order.paymentStatus,
          estimatedTime: order.estimatedTime,
        },
        itemsByMember,
        group: group
          ? {
              id: group.id,
              name: group.name,
              groupMembers: group.groupMembers,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get order",
      error: error.message,
    });
  }
});

// PUT /api/orders/:orderId/status - Update order status
router.put("/:orderId/status", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, paymentStatus } = req.body;

    const order = await Order.findOne({ id: orderId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (status) {
      order.status = status;
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: { order },
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
});

// DELETE /api/orders/:groupId/item/:itemId - Remove item from order
router.delete("/:groupId/item/:itemId", async (req, res) => {
  try {
    const { groupId, itemId } = req.params;
    const { userId } = req.body;

    const order = await Order.findOne({ groupId }).sort({ createdAt: -1 });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Find item and check if user can remove it
    const itemIndex = order.items.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in order",
      });
    }

    const item = order.items[itemIndex];
    if (item.addedBy !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only remove your own items",
      });
    }

    // Remove item
    order.items.splice(itemIndex, 1);
    await order.save();

    res.json({
      success: true,
      message: "Item removed from order",
      data: { order },
    });
  } catch (error) {
    console.error("Remove item error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove item",
      error: error.message,
    });
  }
});

module.exports = router;
