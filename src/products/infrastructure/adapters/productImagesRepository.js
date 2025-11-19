export class ProductImagesRepository {
  async getImagesByProduct(productId, client) {
    try {
      const result = await client.query(
        `
        SELECT id, product_id, url, cloudinary_id, position
        FROM public.product_images
        WHERE product_id = $1
        ORDER BY position ASC
        `,
        [productId]
      );
      return result.rows;
    } catch (error) {
      console.error("❌ Error en getImagesByProduct:", error);
      throw new Error("Error al obtener imágenes del producto");
    }
  }

  async addImage(productId, url, cloudinaryId, position, client) {
    try {
      const result = await client.query(
        `
        INSERT INTO public.product_images (product_id, url, cloudinary_id, position)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [productId, url, cloudinaryId, position]
      );

      return result.rows[0];
    } catch (error) {
      console.error("❌ Error en addImage:", error);
      throw new Error("Error al insertar imagen");
    }
  }

  async deleteImage(imageId, client) {
    try {
      const result = await client.query(
        `
        DELETE FROM public.product_images
        WHERE id = $1
        RETURNING *
        `,
        [imageId]
      );

      return result.rows[0];
    } catch (error) {
      console.error("❌ Error en deleteImage:", error);
      throw new Error("Error al eliminar imagen");
    }
  }

  async deleteImagesByProduct(productId, client) {
    try {
      await client.query(
        `
        DELETE FROM public.product_images
        WHERE product_id = $1
        `,
        [productId]
      );
    } catch (error) {
      console.error("❌ Error en deleteImagesByProduct:", error);
      throw new Error("Error al eliminar imágenes del producto");
    }
  }

  async updateImagePositions(productId, positions, client) {
    try {
      for (const img of positions) {
        await client.query(
          `
          UPDATE public.product_images
          SET position = $1
          WHERE id = $2 AND product_id = $3
          `,
          [img.position, img.id, productId]
        );
      }
    } catch (error) {
      console.error("❌ Error en updateImagePositions:", error);
      throw new Error("Error al actualizar posiciones");
    }
  }
}
