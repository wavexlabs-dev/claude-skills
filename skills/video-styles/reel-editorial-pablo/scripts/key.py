import sys
from PIL import Image
import numpy as np
for src,dst in zip(sys.argv[1::2],sys.argv[2::2]):
    a=np.asarray(Image.open(src).convert('RGB')).astype(float)
    r,g,b=a[...,0],a[...,1],a[...,2]; k=g-np.maximum(r,b)
    alpha=np.clip(1-(k-20)/60,0,1); g2=np.where(k>0,np.maximum(r,b),g)
    o=Image.fromarray(np.dstack([r,g2,b,alpha*255]).astype('uint8'),'RGBA'); o=o.crop(o.getbbox()); o.save(dst); print(dst,o.size)
