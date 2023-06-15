async function resize({
    file,
    maxFileSize,
    maxDimensionPixel,
    maxDeviation = 100,
    iteration = 8,
    targetType = 'image/webp',
    callback
}) {
    let fileSizeKb = file.size / 1024;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
        let canvas;
        let ctx;
        try {
            canvas = document.createElement('canvas');
            ctx = canvas.getContext('2d');

            if (img.width > maxDimensionPixel || img.height > maxDimensionPixel) {
                if (img.width > img.height) {
                    canvas.width = maxDimensionPixel;
                    canvas.height = (img.height / img.width) * maxDimensionPixel;
                } else {
                    canvas.width = (img.width / img.height) * maxDimensionPixel;
                    canvas.height = maxDimensionPixel;
                }
            } else {
                canvas.width = img.width;
                canvas.height = img.height;
            }
        } catch (e) {
            console.log(e)
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        if (fileSizeKb < maxFileSize) {
            return callback(file);
        }

        let blob;
        let lowQuality = 0.0;
        let middleQuality = 0.5;
        let highQuality = 1.0;
        const isJPG =
            file.type === 'image/jpeg' ||
            file.type === 'image/jpg' ||
            file.type === 'image/jfif';
        const isPNG = file.type === 'image/png';
        const getBlob = (ratio) =>
            new Promise((resolve2, reject2) => {
                canvas.toBlob(
                    (blob) => {
                        resolve2(blob);
                    },
                    targetType,
                    ratio
                );
            });
        blob = await getBlob(middleQuality);
        if (isPNG) {
            while (
                Math.abs(blob.size / 1024 - maxSize) > maxDeviation &&
                iteration < 8
            ) {
                console.log('!!!before blob.size', blob.size / 1024, 'kb');
                canvas.width = img.width * middleQuality;
                canvas.height = img.height * middleQuality;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                blob = await getBlob(middleQuality);
                if (blob.size / 1024 < maxSize - maxDeviation) {
                    lowQuality = middleQuality;
                } else if (blob.size / 1024 > maxSize) {
                    highQuality = middleQuality;
                }
                middleQuality = (lowQuality + highQuality) / 2;
                iteration += 1;
                console.log('!!!after blob.size', blob.size / 1024, 'kb');
            }
        } else {
            while (
                Math.abs(blob.size / 1024 - maxSize) > maxDeviation &&
                iteration < 8
            ) {
                console.log('!!!before blob.size', blob.size / 1024, 'kb');
                blob = await getBlob(middleQuality);
                if (blob.size / 1024 < maxSize - maxDeviation) {
                    lowQuality = middleQuality;
                } else if (blob.size / 1024 > maxSize) {
                    highQuality = middleQuality;
                }
                middleQuality = (lowQuality + highQuality) / 2;
                iteration += 1;
                console.log('!!!after blob.size', blob.size / 1024, 'kb');
            }
        }
        console.log('!!!final blob.size', blob.size / 1024, 'kb');
        return callback(blob);
    }
};

export default {
    resize
}